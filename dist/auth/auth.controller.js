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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const newRegister_dto_1 = require("./dto/newRegister.dto");
const content_type_interceptor_1 = require("../common/interceptors/content-type.interceptor");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async register(body) {
        const response = await this.authService.sendOtpAutoRegister(body);
        return response;
    }
    async sendOtp(email) {
        const response = await this.authService.sendOtp(email);
        console.log("sendotp response", response);
        return response;
    }
    async resendOtp(email) {
        const response = await this.authService.resendOtp(email);
        console.log("resendOtp response", response);
        return response;
    }
    async verifyOtp(body) {
        const response = await this.authService.verifyOtp(body.email, body.otp);
        return response;
    }
    async refresh(dto) {
        return this.authService.refreshToken(dto.refresh_token);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('get-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [newRegister_dto_1.newRegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('send-otp'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendOtp", null);
__decorate([
    (0, common_1.Post)('resend-otp'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendOtp", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('refresh-token'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.UseInterceptors)(content_type_interceptor_1.ContentTypeInterceptor),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map