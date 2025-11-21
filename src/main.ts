import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  await app.listen(3000, '0.0.0.0');

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
