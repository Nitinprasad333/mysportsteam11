import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { MailService } from 'src/mail/mail.service';
import { User } from '../user/entities/user/user';
export declare class AuthService {
    private userService;
    private jwtService;
    private mailService;
    constructor(userService: UserService, jwtService: JwtService, mailService: MailService);
    register(data: {
        name: string;
        email: string;
        dob: string;
        mobile: string;
    }): Promise<User>;
    sendOtp(email: string): Promise<{
        statusCode: number;
        message: string;
        data: {
            email: string;
        };
    }>;
    verifyOtp(email: string, otp: string): Promise<{
        statusCode: number;
        message: string;
        data: {
            access_token: string;
            refresh_token: string;
        };
    }>;
    refreshToken(oldToken: string): Promise<{
        statusCode: number;
        message: string;
        data: {
            access_token: string;
            refresh_token: string;
        };
    }>;
    resendOtp(email: string): Promise<{
        statusCode: number;
        message: string;
        data: {
            email: string;
            user: User;
        };
    }>;
    sendOtpAutoRegister(identifier: {
        email?: string;
        mobile?: string;
    }): Promise<{
        statusCode: number;
        message: string;
        data: {
            isUser: boolean;
            user: User;
        };
    }>;
}
