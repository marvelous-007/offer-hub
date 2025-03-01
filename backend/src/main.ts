import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const PORT = process.env.PORT || 3001;
  await app.listen(PORT, () => {
    console.log(chalk.blue.bold('======================================='));
    console.log(chalk.greenBright.bold(`🚀 OFFER-HUB Server is running!`));
    console.log(chalk.blue.bold('======================================='));
    console.log(chalk.cyanBright(`🌍 URL: http://localhost:${PORT}`));
    console.log(chalk.magentaBright(`📅 Started at: ${new Date().toLocaleString()}`));
    console.log(chalk.blue.bold('======================================='));
  });
}
bootstrap();
