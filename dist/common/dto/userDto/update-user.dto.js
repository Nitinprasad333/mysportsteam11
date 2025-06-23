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
exports.UpdateUserDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const class_transformer_2 = require("class-transformer");
class UpdateUserDto {
    name;
    get isUser() {
        return !!(this.name && this.name.trim() !== '');
    }
    email;
    mobile;
    dob;
    profilePicture;
    otp;
    otpExpiresAt;
    refreshToken;
    country;
    state;
    address;
    bio;
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Name is required and cannot be empty or blank' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : value)),
    (0, class_transformer_2.Expose)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_2.Expose)(),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], UpdateUserDto.prototype, "isUser", null);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Email must be a valid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required and cannot be empty or blank' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : value)),
    (0, class_transformer_2.Expose)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Mobile is required and cannot be empty or blank' }),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? value.trim() : value)),
    (0, class_transformer_2.Expose)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "mobile", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'Date of birth must be a valid date string' }),
    (0, class_transformer_2.Expose)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "dob", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_2.Expose)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "profilePicture", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "otp", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "otpExpiresAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "refreshToken", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_2.Expose)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_2.Expose)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_2.Expose)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_2.Expose)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "bio", void 0);
//# sourceMappingURL=update-user.dto.js.map