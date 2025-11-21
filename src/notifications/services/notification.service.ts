import { v4 as uuidv4 } from 'uuid';
import { Injectable, Logger } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { PrismaService } from './prisma.service';
import { rabbitmqConfig } from '../../config/rabbitmq.config';
import { Notification } from '../../global/notification.object';
import { NotificationCreateInput } from '../../global/notification.input';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly client: ClientProxy;

  constructor(private readonly prisma: PrismaService) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqConfig.uri],
        queue: rabbitmqConfig.queues.name,
        exchange: rabbitmqConfig.exchange.name,
        exchangeType: rabbitmqConfig.exchange.type,
        queueOptions: {
          durable: true,
        },
      },
    });
  }

  async fetchAll(): Promise<Notification[]> {
    return this.prisma.notification.findMany();
  }

  private generateMessageId(): string {
    return uuidv4();
  }

  emitNotification(payload: NotificationCreateInput): void {
    const messageId = this.generateMessageId();

    const data = {
      ...payload,
      messageId,
    };

    this.client.emit(rabbitmqConfig.queues.routingKeys.EMAIL, data);

    this.logger.log(
      `[NotificationService] Notification emitted to '${rabbitmqConfig.queues.routingKeys.EMAIL}' with messageId=${messageId}`,
    );
  }
}
