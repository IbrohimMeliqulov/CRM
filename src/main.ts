import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("app/v1")
  const config = new DocumentBuilder()
    .setTitle("CRM N26 group")
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("swagger", app, documentFactory)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
