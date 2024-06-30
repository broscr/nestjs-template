/**
 * Log dosyalarının isim ve konum bilgileri.
 *
 */
export enum LogLocation {
  INFO_LOG_LOCATION = './../logs/info',
  INFO_LOG_NAME = 'info-%DATE%.log',
  ERROR_LOG_LOCATION = './../logs/error',
  ERROR_LOG_NAME = 'error-%DATE%.log',
}

/**
 * Kullanıcı tipleri
 *
 */
export enum USER_TYPE {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
