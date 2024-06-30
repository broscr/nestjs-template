import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import ERROR_TEXT from '../utility/ErrorText';

/**
 * Mobil app için gerekli olan mobilekey kontrolü yapar. Yetkisiz erişim denemesi hatası fırlatır.
 *
 */
@Injectable()
export class MobileMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { mobilekey } = req.headers;

    if (process.env.MOBILE_KEY !== mobilekey)
      throw new HttpException(
        ERROR_TEXT.UNAUTHORIZED_ATTEMPT,
        HttpStatus.UNAUTHORIZED,
      );
    next();
  }
}
