import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schema/User';
import { UserSession } from '../types/Types';
import { USER_TYPE } from '../utility/Constants';
import ERROR_TEXT from '../utility/ErrorText';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly httpService: HttpService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    if (
      username === process.env.SUPERSU_NAME &&
      process.env.SUPERSU_PASS === pass
    ) {
      return {
        id: process.env.SUPERSU_ID,
        name: process.env.SUPERSU_NAME,
        role: [USER_TYPE.ADMIN],
      };
    } else {
      throw new HttpException(
        ERROR_TEXT.UNAUTHORIZED_ATTEMPT,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async loginAdmin(user: UserSession): Promise<UserSession> {
    if (user.name === process.env.SUPERSU_NAME) {
      const userRole = {
        name: process.env.SUPERSU_NAME,
        _id: process.env.SUPERSU_ID,
        role: [USER_TYPE.ADMIN],
      };

      const payload = {
        name: userRole.name,
        sub: userRole._id,
        role: userRole.role,
      };

      return {
        _id: userRole._id,
        name: userRole.name,
        accessToken: await this.jwtService.signAsync(payload),
        role: userRole.role,
      } as UserSession;
    } else {
      throw new HttpException(
        ERROR_TEXT.UNAUTHORIZED_ATTEMPT,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  /**
   * Login ve SignUp olarak kullanılacak.
   * Kullanıcı oturum açarken yada ilk kez kayıt yaparken burayı kullanacak.
   * Google IdToken keyini alır eğer kullanıcı yoksa yeni bir kullanıcı oluşturup  yada kayıtlı kullanıcı bilgisini geriye jwt ile döner.
   *
   * @param userkey
   * @returns
   */
  async login(userkey: string): Promise<UserSession> {
    try {
      const googleAuthCheck = await this.httpService.axiosRef.get(
        'https://oauth2.googleapis.com/tokeninfo',
        {
          params: {
            id_token: userkey,
          },
        },
      );

      const { email, name, picture } = googleAuthCheck.data;

      let user = await this.userModel.findOne({
        email: email,
      });

      if (!user)
        user = await this.userModel.create({
          email,
          name,
          profileImg: picture,
        });

      const payload = {
        name: user.name,
        sub: user._id,
        role: user.role,
      };
      return {
        _id: user._id.toString(),
        name: user.name,
        accessToken: await this.jwtService.signAsync(payload),
        role: user.role,
        profileImg: user.profileImg,
        email: user.email,
      } as UserSession;
    } catch (e: any) {
      if (e.response?.data?.error)
        throw new HttpException(e.response.data.error, HttpStatus.UNAUTHORIZED);
      else
        throw new HttpException(
          ERROR_TEXT.UNAUTHORIZED_ATTEMPT,
          HttpStatus.BAD_REQUEST,
        );
    }
  }
}
