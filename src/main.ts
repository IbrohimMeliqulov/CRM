import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("app/v1")
  const config = new DocumentBuilder()
    .setTitle("CRM N26 group")
    .addBearerAuth()
    .build()
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }))
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("swagger", app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true
    }
  })
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
