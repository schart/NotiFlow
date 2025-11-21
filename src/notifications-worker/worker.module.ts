import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { NotificationConsumerController } from './consumers/notification.consumer';
import { EmailProcessor } from './processors/email.processor';
import { PrismaService } from '../notifications/services/prisma.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.SMTP_HOST,
          port: 587,
          secure: Boolean(process.env.SMTP_SECURE), // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        },
        defaults: {
          from: process.env.SENDER_EMAIL,
        },
      }),
    }),

    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
  ],
  controllers: [NotificationConsumerController],
  providers: [WorkerModule, EmailProcessor, PrismaService],
})
export class WorkerModule {}
