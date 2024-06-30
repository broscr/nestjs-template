import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserSession } from '../types/Types';
import { LoginDto } from '../dto/LoginDto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login_admin')
  async loginA(@Request() req) {
    return await this.authService.loginAdmin(req.user);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<UserSession> {
    return await this.authService.login(loginDto.userkey);
  }
}
