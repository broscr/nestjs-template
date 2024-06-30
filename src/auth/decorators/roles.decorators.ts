import { SetMetadata } from '@nestjs/common';
import { USER_TYPE } from 'src/utility/Constants';

/**
 * Uygulama içinde rolleri temsil etmek için kullanılan anahtar.
 */
export const ROLES_KEY = 'roles';

/**
 * Kullanıcı rollerini belirten dekoratör.
 *
 * @param {...USER_TYPE[]} roles - Kullanıcının sahip olabileceği rollerin listesi
 * @returns {Function} - Rollerin dekoratör olarak kullanılmasını sağlayan fonksiyon
 */
export const Roles = (...roles: USER_TYPE[]) => SetMetadata(ROLES_KEY, roles);
