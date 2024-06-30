import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { isArray } from 'class-validator';
import ERROR_TEXT from 'src/utility/ErrorText';

type ResponseError = {
  message: string[];
  error: string;
  statusCode: number;
};

/**
 * Özelleştirilmiş http mesajlarını oluşturmak için kullanılcak global middleware.
 * Tüm hata mesajları burada yakalanır ve geri döndürülür.
 */
@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger();

  catch(exception: HttpException, host: ArgumentsHost): any {
    /**
     * Ekrana basıp excetion detayını görebilmek için eklendi productionda silinecek.
     * @todo console.log silinecek production aşamasında.
     */
    console.log(exception);

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const message = exception?.message;

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.BAD_REQUEST;

    const devErrorResponse: any = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      ip: request.ip,
      method: request.method,
      errorName: exception?.name,
      message: this.checkException(
        exception.message,
        exception && typeof exception.getResponse === 'function'
          ? (exception.getResponse() as ResponseError)
          : null,
      ),
    };

    const prodErrorResponse: any = {
      statusCode,
      message: this.checkException(
        message,
        exception && typeof exception.getResponse === 'function'
          ? (exception.getResponse() as ResponseError)
          : null,
      ),
    };

    this.logger.error(
      `request method: ${request.method} request url${request.url}`,
      JSON.stringify(devErrorResponse),
    );

    response.status(statusCode).json(prodErrorResponse);
  }

  /**
   * Gelen mesajı kontrol eder ve özelleştirip geri döner.
   *
   * @param message hata mesajı
   * @returns özelliştirilen mesaj metni
   */
  private checkException(message: string, response?: ResponseError): string {
    /**
     * burada tüm hata mesajları takip edilip özelliştirilebilir.
     * @todo burayı düzenlemek lazım eğer özel mesajlar geri döneceksek.
     */

    if (isArray(response?.message)) return response.message[0].toString();

    if (
      message.includes('E11000 duplicate key error collection: callerid.users')
    )
      return ERROR_TEXT.DUPLICATE_KEY_EMAIL;

    return message;
  }
}
