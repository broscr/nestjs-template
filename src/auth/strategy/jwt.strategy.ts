import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * JWT (JSON Web Token) kimlik doğrulama stratejisi.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * JWT doğrulama başarılı olduğunda çağrılan metot.
   *
   * @param {any} payload - Doğrulama işleminden elde edilen JWT paylaşımı
   * @returns {object} - Doğrulama sonuçları
   */
  async validate(payload: any) {
    return {
      _id: payload.sub,
      name: payload.name,
      role: payload.role,
    };
  }
}
