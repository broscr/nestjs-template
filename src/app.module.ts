import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AdminMiddleware } from './middleware/admin.middleware';
import { MobileMiddleware } from './middleware/mobile.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    AuthModule,
  ],
})
export class AppModule {
  /**
   * Admin ve mobil istekler için ayrı ayrı middleware tanımlandı.
   *  Versiyonlama ile kullanılmak zorunda.
   *
   * @param consumer middleware oluşturucu
   */
  configure(consumer: MiddlewareConsumer) {
    // ssl pinning yapıldığında açılacak.
    // consumer.apply(SslCertificateMiddleware).forRoutes('*');
    consumer.apply(MobileMiddleware).forRoutes('v1/auth', 'v1/mobile');
    consumer.apply(AdminMiddleware).forRoutes('v1/admin');
  }
}
