"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const user_service_1 = require("../user/user.service");
const crypto_1 = require("crypto");
const mail_service_1 = require("../mail/mail.service");
const class_transformer_1 = require("class-transformer");
const user_1 = require("../user/entities/user/user");
let AuthService = class AuthService {
    userService;
    jwtService;
    mailService;
    constructor(userService, jwtService, mailService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async register(data) {
        const existingUser = await this.userService.findByEmail(data.email);
        const existingMobile = await this.userService.findByMobile(data.mobile);
        if (existingUser) {
            throw new common_1.BadRequestException('Email already exists with user');
        }
        if (existingMobile) {
            throw new common_1.BadRequestException('Mobile number already exists with user');
        }
        return this.userService.create(data);
    }
    async sendOtp(email) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const otp = (0, crypto_1.randomInt)(100000, 999999).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);
        user.otp = hashedOtp;
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
    async verifyOtp(email, otp) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (!user.name || user.name.trim() === '') {
            throw new common_1.BadRequestException('You are first-time user. Please update your name');
        }
        if (!user.otp || !user.otpExpiresAt) {
            throw new common_1.BadRequestException('OTP not requested');
        }
        const isOtpValid = await bcrypt.compare(otp, user.otp);
        if (!isOtpValid) {
            throw new common_1.UnauthorizedException('Invalid OTP');
        }
        if (new Date(user.otpExpiresAt) < new Date()) {
            throw new common_1.UnauthorizedException('OTP expired');
        }
        await this.userService.update(user.id, {
            otp: '',
            otpExpiresAt: undefined,
        });
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
    async refreshToken(oldToken) {
        try {
            const payload = this.jwtService.verify(oldToken);
            const user = await this.userService.findByEmail(payload.email);
            if (!user || !user.refreshToken) {
                throw new common_1.UnauthorizedException('Access denied');
            }
            const tokenMatch = await bcrypt.compare(oldToken, user.refreshToken);
            if (!tokenMatch) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const newAccessToken = this.jwtService.sign({
                id: user.id,
                email: user.email,
            });
            const newRefreshToken = this.jwtService.sign({ id: user.id, email: user.email }, { expiresIn: process.env.JWT_EXPIRES_IN });
            await this.userService.updateRefreshToken(user.id, newRefreshToken);
            return {
                statusCode: 200,
                message: 'Token refreshed',
                data: {
                    access_token: newAccessToken,
                    refresh_token: newRefreshToken,
                },
            };
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
    async resendOtp(email) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const otp = (0, crypto_1.randomInt)(100000, 999999).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);
        user.otp = hashedOtp;
        user.otpExpiresAt = otpExpiresAt;
        await this.userService.update(user.id, {
            otp: otp,
            otpExpiresAt: otpExpiresAt.toISOString(),
        });
        console.log(`Resend OTP for ${email}: ${otp}`);
        await this.mailService.sendOtpEmail(email, otp);
        return {
            statusCode: 200,
            message: 'OTP resent on email address',
            data: {
                email: email,
                user: (0, class_transformer_1.plainToInstance)(user_1.User, user)
            },
        };
    }
    async sendOtpAutoRegister(identifier) {
        const { email, mobile } = identifier;
        if (!email && !mobile) {
            throw new common_1.BadRequestException('Either email or mobile number is required');
        }
        let user = null;
        if (email) {
            user = await this.userService.findByEmail(email);
        }
        else if (mobile) {
            user = await this.userService.findByMobile(mobile);
        }
        if (!user) {
            const createPayload = {};
            if (email && email.trim())
                createPayload.email = email.trim();
            if (mobile && mobile.trim())
                createPayload.mobile = mobile.trim();
            user = await this.userService.create(createPayload);
        }
        if (!user || !user.id) {
            throw new common_1.InternalServerErrorException('User creation failed.');
        }
        const otp = (0, crypto_1.randomInt)(1000, 9999).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);
        await this.userService.update(user.id, {
            otp: hashedOtp,
            otpExpiresAt: otpExpiresAt.toISOString(),
        });
        if (email) {
            await this.mailService.sendOtpEmail(email, otp);
        }
        else if (mobile) {
            console.log(`Send SMS OTP to ${mobile}: ${otp}`);
        }
        const isUser = !!(user.name && user.name.trim() !== '');
        const transformedUser = (0, class_transformer_1.plainToInstance)(user_1.User, user);
        return {
            statusCode: 200,
            message: `OTP sent on ${email ? 'email address' : 'mobile number'}`,
            data: {
                isUser,
                user: transformedUser,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map