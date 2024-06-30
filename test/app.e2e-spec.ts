import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login_admin (POST)', async () => {
    const username = 'admin';
    const password = 'admin123';

    const response = await request(app.getHttpServer())
      .post('/auth/login_admin')
      .send({ username, password })
      .expect(401);

    // Burada dönen yanıtın doğruluğunu kontrol ediyoruz!
    expect(response.body).toHaveProperty('statusCode');
    expect(response.body).toHaveProperty('message');
  });
});
