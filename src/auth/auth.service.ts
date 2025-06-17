import { Injectable, UnauthorizedException, BadRequestException,NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { randomInt } from 'crypto'; // Node built-in
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
constructor(
    private userService: UserService,
    private jwtService: JwtService,
        private mailService: MailService,
) {}





//Register a New User Service
async register(data: {
  name: string;
  email: string;
  dob: string;
  mobile: string;
}) {

  const existingUser = await this.userService.findByEmail(data.email);
  if (existingUser) {
    throw new BadRequestException('Email already exists');
  }

  return this.userService.create(data);
}



//Send OTP Service
async sendOtp(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate 6-digit OTP
    const otp = randomInt(100000, 999999).toString();

    // Set expiry 15 minutes from now
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Save otp and expiry in user record
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await this.userService.update(user.id, user);

    // TODO: Send otp via email here
    // You can integrate with nodemailer, SendGrid, or any email provider

    console.log(`OTP for ${email}: ${otp}`); // For dev/testing
    await this.mailService.sendOtpEmail(email, otp);
 
    return {
  "statusCode": 200,
  "message": "OTP sent on email address",
  "data": {
    "email":email
  }
}
    
}


//Verify OTP Service
async verifyOtp(email: string, otp: string) {
const user = await this.userService.findByEmail(email);
if (!user) {
    throw new NotFoundException('User not found');
}

if (!user.otp || !user.otpExpiresAt) {
    throw new BadRequestException('OTP not requested');
}

if (user.otp !== otp) {
    throw new UnauthorizedException('Invalid OTP');
}

if (user.otpExpiresAt < new Date()) {
    throw new UnauthorizedException('OTP expired');
}

  // Clear OTP after successful verification
await this.userService.update(user.id, { otp: '', otpExpiresAt: undefined });

  // Create JWT payload and return token
const payload = { id: user.id, email: user.email };
return {
  "statusCode": 200,
  "message": "OTP verified successfully",
  "data": {
    "access_token":this.jwtService.sign(payload)
  }
}



}


}









