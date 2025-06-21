import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { randomInt } from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { plainToInstance } from 'class-transformer';
import { User } from '../user/entities/user/user';

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
    const existingMobile = await this.userService.findByMobile(data.mobile);
    if (existingUser) {
      throw new BadRequestException('Email already exists with user');
    }

    if (existingMobile) {
      throw new BadRequestException('Mobile number already exists with user');
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

    // Set expiry 2 minutes from now
    const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);

    // Save otp and expiry in user record
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await this.userService.update(user.id, {
      otp: otp,
      otpExpiresAt: otpExpiresAt.toISOString(),
    });

    
    console.log(`OTP for ${email}: ${otp}`); 
    await this.mailService.sendOtpEmail(email, otp);

    return {
      statusCode: 200,
      message: 'OTP sent on email address',
      data: {
        email: email,
      },
    };
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
    await this.userService.update(user.id, {
      otp: '',
      otpExpiresAt: undefined,
    });

    // Create JWT payload and return token
    const payload = { id: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    await this.userService.updateRefreshToken(user.id, refreshToken);
    return {
      statusCode: 200,
      message: 'OTP verified successfully',
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    };
  }

  async refreshToken(oldToken: string) {
    try {
      const payload = this.jwtService.verify(oldToken);
      const user = await this.userService.findByEmail(payload.email);

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Access denied');
      }

      const tokenMatch = await bcrypt.compare(oldToken, user.refreshToken);
      if (!tokenMatch) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = this.jwtService.sign({
        id: user.id,
        email: user.email,
      });

      const newRefreshToken = this.jwtService.sign(
        { id: user.id, email: user.email },
        { expiresIn: process.env.JWT_EXPIRES_IN },
      );

      await this.userService.updateRefreshToken(user.id, newRefreshToken);

      return {
        statusCode: 200,
        message: 'Token refreshed',
        data: {
          access_token: newAccessToken,
          refresh_token: newRefreshToken,
        },
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async resendOtp(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate 6-digit OTP
    const otp = randomInt(100000, 999999).toString();

    // Set expiry 2 minutes from now
    const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);

    // Save otp and expiry in user record
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await this.userService.update(user.id, {
      otp: otp,
      otpExpiresAt: otpExpiresAt.toISOString(),
    });

    // TODO: ReSend otp via email here
  
    console.log(`Resend OTP for ${email}: ${otp}`); 
    await this.mailService.sendOtpEmail(email, otp);

    return {
      statusCode: 200,
      message: 'OTP resent on email address',
      data: {
        email: email,
      },
    };
  }



async sendOtpAutoRegister(identifier: { email?: string; mobile?: string }) {
  const { email, mobile } = identifier;

  // Ensure at least one identifier is provided
  if (!email && !mobile) {
    throw new BadRequestException('Either email or mobile number is required');
  }

  let user: any = null;
  let isUser = false;

  // Check for existing user
  if (email) {
    user = await this.userService.findByEmail(email);
  } else if (mobile) {
    user = await this.userService.findByMobile(mobile);
  }

  if (user) {
    isUser = true;
  } else {
    // Create user with provided info
 const createPayload: any = {};
if (email && email.trim()) createPayload.email = email.trim();
if (mobile && mobile.trim()) createPayload.mobile = mobile.trim();

user = await this.userService.create(createPayload);
  }

  // Generate OTP
  const otp = randomInt(1000, 9999).toString();
  const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);

  // Save OTP to user
  await this.userService.update(user.id, {
    otp,
    otpExpiresAt: otpExpiresAt.toISOString(),
  });

  // Send OTP
  if (email) {
    await this.mailService.sendOtpEmail(email, otp);
  } else if (mobile) {
    //will Implement SMS service here
    console.log(`Send SMS OTP to ${mobile}: ${otp}`);
    // await this.smsService.sendOtp(mobile, otp); (if using Twilio, etc.)
  }

  return {
    statusCode: 200,
    message: `OTP sent on ${email ? 'email address' : 'mobile number'}`,
    data: {
      // email: email || null,
      // mobile: mobile || null,
      isUser,
      user: plainToInstance(User, user),
   
    },
  };
}


}
