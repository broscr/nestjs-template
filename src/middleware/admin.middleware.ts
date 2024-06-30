import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import ERROR_TEXT from '../utility/ErrorText';

/**
 * Oturum sistemi için gerekli olan authkey kontrolü yapar. Yetkisiz erişim denemesi hatası fırlatır.
 *
 */
@Injectable()
export class AdminMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { authkey } = req.headers;

    if (process.env.AUTH_KEY !== authkey)
      throw new HttpException(
        ERROR_TEXT.UNAUTHORIZED_ATTEMPT,
        HttpStatus.UNAUTHORIZED,
      );
    next();
  }
}
