import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import ERROR_TEXT from '../../utility/ErrorText';

/**
 * Yerel kimlik doğrulama stratejisi.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  /**
   * Kullanıcı kimlik doğrulama işlemini gerçekleştirir.
   *
   * @param {string} username - Kullanıcı adı
   * @param {string} password - Kullanıcı şifresi
   * @returns {Promise<any>} - Kullanıcı nesnesi
   * @throws {HttpException} - Kimlik doğrulama başarısız olduğunda hata fırlatılır
   */
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);

    // Eğer kullanıcı doğrulanamazsa, hata fırlat
    if (!user)
      throw new HttpException(
        ERROR_TEXT.UNAUTHORIZED_ATTEMPT,
        HttpStatus.UNAUTHORIZED,
      );

    return user;
  }
}
