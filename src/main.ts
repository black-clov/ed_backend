import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync } from 'fs';
import { AppModule } from './app.module';
import { uploadsDir } from './admin/upload.controller';

async function bootstrap() {
  if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const allowedOrigins = [
    'https://ed-backend-o1dv.onrender.com',
    ...(config.get<string>('NODE_ENV') !== 'production'
      ? ['http://localhost:3000', 'http://localhost:4200', 'http://localhost:8080']
      : []),
  ];
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, x-upload-id, x-chunk-index',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const port = config.get<number>('PORT', 3000);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
