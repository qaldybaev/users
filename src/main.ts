import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {  ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("/api")
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    whitelist: true,
    transform: true,
  }
  ))
  const config = new DocumentBuilder()
    .setTitle('User Api')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  if (process.env?.NODE_ENV?.trim() === "development") {
    SwaggerModule.setup('doc', app, documentFactory);
  }
  app.useGlobalFilters(new HttpExceptionFilter)

  const PORT = process.env.APP_PORT ? Number(process.env.APP_PORT) : 4000
  await app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`)
  });
}
bootstrap();
