import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Yerel kimlik doğrulama koruyucusu.
 * Bu koruyucu, 'local' stratejisi kullanılarak oluşturulmuştur.
 * @see https://docs.nestjs.com/recipes/passport
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
