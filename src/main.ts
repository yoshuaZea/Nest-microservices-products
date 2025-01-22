import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Products Main');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    // * Using TCP protocole
    // {
    //   transport: Transport.TCP,
    //   options: {
    //     port: envs.port,
    //   },
    // },
    // * Using NATS
    {
      transport: Transport.NATS,
      options: {
        servers: envs.nats_servers, // * It is an array
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen();

  // await app.startAllMicroservices();

  logger.log(`Products Microservice is running on port: ${envs.port}`);
}
bootstrap();
