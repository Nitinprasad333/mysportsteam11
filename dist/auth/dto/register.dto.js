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
exports.RegisterDto = void 0;
const class_validator_1 = require("class-validator");
class RegisterDto {
    name;
    email;
    dob;
    mobile;
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Name is required' }),
    (0, class_validator_1.IsString)({ message: 'Name must be a string' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Email must be valid' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Date of birth is required' }),
    (0, class_validator_1.IsString)({ message: 'Date of birth must be a string' }),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/, { message: 'DOB must be in YYYY-MM-DD format' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "dob", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Mobile number is required' }),
    (0, class_validator_1.Matches)(/^\d{10}$/, { message: 'Mobile number must be 10 digits' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "mobile", void 0);
//# sourceMappingURL=register.dto.js.map