// src/auth/auth.controller.ts
import { Controller, Post, Body,UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { newRegisterDto } from './dto/newRegister.dto';
import { ContentTypeInterceptor } from 'src/common/interceptors/content-type.interceptor';

@UseInterceptors(ContentTypeInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Post('register')
  // async register(@Body() body:RegisterDto) {
  //     const response  = await this.authService.register(body);
  // return response;
  // }

  /*Auto Register using email or mobile and get OTP*/
  @Post('get-otp')
  async getOTP(@Body() body: newRegisterDto) {
    const response = await this.authService.sendOtpAutoRegister(body);
    return response;
  }

  /* Send OTP to email for registration*/
  @Post('send-otp')
  async sendOtp(@Body('email') email: string) {
    const response = await this.authService.sendOtp(email);
    console.log('sendotp response', response);
    return response;
  }

  /* Resend OTP*/
  @Post('resend-otp')
  async resendOtp(@Body('email') email: string) {
    const response = await this.authService.resendOtp(email);
    console.log('resendOtp response', response);
    return response;
  }

  /* Verify OTP */
  @Post('verify-otp')
  async verifyOtp(@Body() body: { email: string; otp: string }) {
    const response = await this.authService.verifyOtp(body.email, body.otp);
    return response;
  }

  /* Refresh Token*/
  @Post('refresh-token')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refresh_token);
  }
}