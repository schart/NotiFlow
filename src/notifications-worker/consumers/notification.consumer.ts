import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { EmailProcessor } from '../processors/email.processor';
import { rabbitmqConfig } from '../../config/rabbitmq.config';
import { Notification } from '../../global/notification.object';

@Controller()
export class NotificationConsumerController {
  private readonly logger = new Logger(NotificationConsumerController.name);

  constructor(private readonly processor: EmailProcessor) {}

  @MessagePattern(rabbitmqConfig.queues.routingKeys.EMAIL)
  async handleEmailNotifications(
    @Payload() payload: Notification,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const data = payload;

    const channel = context.getChannelRef();
    const message = context.getMessage();
    const headers = message.properties?.headers ?? {};

    const attempt = headers['x-attempt'] ? headers['x-attempt'] + 1 : 1;

    this.logger.log(
      `[Email Worker] Received messageId=${data.messageId}, attempt=${attempt}`,
    );

    try {
      // Idempotent
      const isDuplicate = await this.processor.checkIdempotency(data.messageId);
      if (isDuplicate) {
        this.logger.warn(
          `[Email Worker] Duplicate skipped: messageId=${data.messageId}`,
        );
        channel.ack(message);
        return;
      }

      // Business logic
      await this.processor.sendEmail({
        email: data.destination,
        subject: data.subject,
        text: data.text,
      });
      await this.processor.createLog(data);

      channel.ack(message);
      this.logger.log(
        `[Email Worker] Acknowledged messageId=${data.messageId}`,
      );
    } catch (error) {
      // 3 retries max
      if (attempt >= 3) {
        this.logger.error(
          `[Email Worker] Max retries reached for messageId=${data.messageId}. Sending to DLQ.`,
        );

        channel.nack(message, false, false); // DLQ
        return;
      }

      // Requeue with incremented attempts
      channel.publish('', message.fields.routingKey, message.content, {
        headers: { ...headers, 'x-attempt': attempt },
        persistent: true,
      });

      channel.ack(message);

      this.logger.warn(
        `[Email Worker] Retrying messageId=${data.messageId}, attempt=${attempt}`,
      );
    }
  }
}
