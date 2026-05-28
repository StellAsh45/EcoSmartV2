import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Habilitar validaciones para los DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // remueve campos que no esten en el DTO
    forbidNonWhitelisted: true,
  }));

  // Aumentar límite de payload para soportar imágenes en base64
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.enableCors();

  // Servir archivos estáticos
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(process.env.PORT ?? 3000);
  console.log('API corriendo en http://localhost:3000');
}
bootstrap();
