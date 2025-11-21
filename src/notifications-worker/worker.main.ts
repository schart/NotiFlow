import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { WorkerModule } from './worker.module';
import { rabbitmqConfig } from '../config/rabbitmq.config';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.createMicroservice(WorkerModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqConfig.uri],
      queue: rabbitmqConfig.queues.name,
      queueOptions: {
        durable: true,
      },
      exchange: rabbitmqConfig.exchange.name,
      exchangeType: rabbitmqConfig.exchange.type,
      prefetchCount: 1,
      noAck: false,
    },
  });

  await app.listen();

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
