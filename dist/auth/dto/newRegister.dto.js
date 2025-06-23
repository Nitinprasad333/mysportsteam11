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
exports.newRegisterDto = void 0;
const class_validator_1 = require("class-validator");
let EitherEmailOrMobileConstraint = class EitherEmailOrMobileConstraint {
    validate(_, args) {
        const obj = args.object;
        return !!(obj.email?.trim() || obj.mobile?.trim());
    }
    defaultMessage(args) {
        return 'Either email or mobile number must be provided and cannot be blank';
    }
};
EitherEmailOrMobileConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'EitherEmailOrMobile', async: false })
], EitherEmailOrMobileConstraint);
function EitherEmailOrMobile(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'EitherEmailOrMobile',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: EitherEmailOrMobileConstraint,
        });
    };
}
class newRegisterDto {
    email;
    mobile;
    dummyField;
}
exports.newRegisterDto = newRegisterDto;
__decorate([
    (0, class_validator_1.ValidateIf)(o => o.email !== undefined),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email cannot be empty' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Email must be valid' }),
    __metadata("design:type", String)
], newRegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)(o => o.mobile !== undefined),
    (0, class_validator_1.IsNotEmpty)({ message: 'Mobile number cannot be empty' }),
    (0, class_validator_1.Matches)(/^\d{10}$/, { message: 'Mobile number must be 10 digits' }),
    __metadata("design:type", String)
], newRegisterDto.prototype, "mobile", void 0);
__decorate([
    EitherEmailOrMobile({ message: 'Either email or mobile number must be provided and cannot be blank' }),
    __metadata("design:type", String)
], newRegisterDto.prototype, "dummyField", void 0);
//# sourceMappingURL=newRegister.dto.js.map