import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpErrorFilter } from './filters/http-exception.filter';
import helmet from 'helmet';
// import * as fs from 'fs';
import * as path from 'path';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { LogLocation } from './utility/Constants';

async function bootstrap() {
  const logger = new Logger();

  /**
   * @todo SSL Pinleme yapılacak ve clientlar için ssl paylaşılacak.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const httpsOptions = {
    // key: fs.readFileSync('server.key'),
    // cert: fs.readFileSync('server.cert'),
  };

  /**
   * App start point;
   * @summary Winston günlük error ve info tiplerinde log dosyaları oluşturur.
   *
   */
  const app = await NestFactory.create(AppModule, {
    //httpsOptions,
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('NoteApp-Server', {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
        new winston.transports.DailyRotateFile({
          dirname: path.join(__dirname, LogLocation.INFO_LOG_LOCATION),
          filename: LogLocation.INFO_LOG_NAME,
          level: 'info',
          zippedArchive: true,
          datePattern: 'YYYY-MM-DD',
          maxFiles: '30d',
          maxSize: '20m',
        }),
        new winston.transports.DailyRotateFile({
          dirname: path.join(__dirname, LogLocation.ERROR_LOG_LOCATION),
          filename: LogLocation.ERROR_LOG_NAME,
          level: 'error',
          zippedArchive: true,
          datePattern: 'YYYY-MM-DD',
          maxFiles: '30d',
          maxSize: '20m',
        }),
      ],
    }),
  });
  /**
   * CORS origin aktif edildi.
   *
   */
  app.enableCors();

  /**
   * Güvenlik özelliklerini içeren helmet yardımcı paket.
   *  @link https://helmetjs.github.io/
   */
  app.use(helmet());

  /**
   * Gelen isteklerin doğruluğunu kontrol eder ve gerekli kısıtlamaları yazmayı sağlayan değerler sağlar.
   * DTO kullanmak için gerekli olan paket..
   *
   */
  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));

  /**
   * Geriye dönücek hata mesajlarını yakalayıp özelleştirmek için kullanılır.
   *
   */
  app.useGlobalFilters(new HttpErrorFilter());

  /**
   * Versiyonlama aktif edildi. v1 ... v2 gibi aynı anda çalışabilir bir yapıya sahip olması sağlandı.
   *
   */
  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(process.env.PORT);

  logger.warn(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
