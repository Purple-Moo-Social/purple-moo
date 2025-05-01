//src\main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);

  app.enableCors({
    origin: ['http://localhost:8081', 'exp://192.168.1.42:8081'],
    credentials: true,
  });
}

bootstrap().catch((err) => {
  console.error('Application failed to start', err);
  process.exit(1);
});
