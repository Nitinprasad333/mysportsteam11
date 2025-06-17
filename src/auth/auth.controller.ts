// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
constructor(private authService: AuthService) {}

@Post('register')
async register(@Body() body:RegisterDto) {
    const response  = await this.authService.register(body);
return response;
}

@Post('send-otp')
async sendOtp(@Body('email') email: string) {
  const response = await this.authService.sendOtp(email);
  console.log("sendotp response", response);
  return response;
}

@Post('verify-otp')
async verifyOtp(@Body() body: { email: string; otp: string }) {
    const response = await this.authService.verifyOtp(body.email, body.otp);
return response;
}



}