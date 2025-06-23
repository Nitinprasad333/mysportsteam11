import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { newRegisterDto } from './dto/newRegister.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: newRegisterDto): Promise<{
        statusCode: number;
        message: string;
        data: {
            isUser: boolean;
            user: import("../user/entities/user/user").User;
        };
    }>;
    sendOtp(email: string): Promise<{
        statusCode: number;
        message: string;
        data: {
            email: string;
        };
    }>;
    resendOtp(email: string): Promise<{
        statusCode: number;
        message: string;
        data: {
            email: string;
            user: import("../user/entities/user/user").User;
        };
    }>;
    verifyOtp(body: {
        email: string;
        otp: string;
    }): Promise<{
        statusCode: number;
        message: string;
        data: {
            access_token: string;
            refresh_token: string;
        };
    }>;
    refresh(dto: RefreshTokenDto): Promise<{
        statusCode: number;
        message: string;
        data: {
            access_token: string;
            refresh_token: string;
        };
    }>;
}
