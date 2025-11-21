import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../notifications/services/prisma.service';
import { NotificationCreateInput } from '../../global/notification.input';
import { Notification } from '../../global/notification.object';

@Injectable()
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST'),
      port: this.config.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.config.get<string>('SMTP_USER'),
        pass: this.config.get<string>('SMTP_PASS'),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
  async sendEmail(data: { email: string; subject: string; text: string }) {
    try {
      await this.transporter.sendMail({
        from: this.config.get<string>('SENDER_EMAIL'),
        to: data.email,
        subject: data.subject,
        text: data.text,
      });
    } catch (e) {
      this.logger.error({ service: 'Email Worker', error: e.message });
      throw new InternalServerErrorException(e.message);
    }
  }

  async checkIdempotency(messageId: string): Promise<Notification | null> {
    try {
      const result: Notification | null =
        await this.prisma.notification.findUnique({
          where: {
            messageId: messageId,
          },
        });

      return result;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  // Create Notification Log
  async createLog(input: NotificationCreateInput): Promise<Notification> {
    try {
      const data = { ...input };
      const result = await this.prisma.notification.create({ data });

      this.logger.log(`[Email Processor] Notification created successfully`, {
        messageId: input.messageId,
      });
      return result;
    } catch (e) {
      this.logger.error({ service: 'notification', error: e, input });
      if (e.code == 'P2002') {
        throw new ConflictException(
          `Notification with messageId ${input.messageId} already exists`,
        );
      }

      throw new InternalServerErrorException('Failed to create notification');
    }
  }
}
