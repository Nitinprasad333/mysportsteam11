// src/user/user.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile() {
    return { msg: 'Protected route works!' };
  }
}