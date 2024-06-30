import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { USER_TYPE } from '../utility/Constants';
import { LoginDto } from '../dto/LoginDto';
import { UserSession } from '../types/Types';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            loginAdmin: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('loginA', () => {
    it('should return the result of authService.loginAdmin', async () => {
      const user = { username: 'admin', password: 'password' };
      const req = { user };
      const expectedResult = {
        accessToken: 'adminToken',
        _id: 'id',
        name: 'name',
        role: [USER_TYPE.ADMIN],
      };

      jest.spyOn(authService, 'loginAdmin').mockResolvedValue(expectedResult);

      const result = await authController.loginA(req);

      expect(result).toBe(expectedResult);
      expect(authService.loginAdmin).toHaveBeenCalledWith(user);
    });
  });

  describe('login', () => {
    it('should return the result of authService.login', async () => {
      const loginDto: LoginDto = { userkey: 'user123' };
      const expectedResult: UserSession = {
        _id: '1',
        name: 'John Doe',
        accessToken: 'token',
        role: [USER_TYPE.USER],
      };

      jest.spyOn(authService, 'login').mockResolvedValue(expectedResult);

      const result = await authController.login(loginDto);

      expect(result).toBe(expectedResult);
      expect(authService.login).toHaveBeenCalledWith(loginDto.userkey);
    });
  });
});
