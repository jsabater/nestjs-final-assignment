import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propietats que no estan definides al DTO
      forbidNonWhitelisted: true, // Retorna un error si el client envia propietats que no estan permeses
      transform: true, // Permet transformar dades quan NestJS té informació suficient
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
