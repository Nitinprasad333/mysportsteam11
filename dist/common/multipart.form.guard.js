"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipartFormGuard = void 0;
const common_1 = require("@nestjs/common");
let MultipartFormGuard = class MultipartFormGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const contentType = request.headers['content-type'];
        if (!contentType?.startsWith('multipart/form-data')) {
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                message: 'Content-Type must be multipart/form-data',
            }, common_1.HttpStatus.UNSUPPORTED_MEDIA_TYPE);
        }
        return true;
    }
};
exports.MultipartFormGuard = MultipartFormGuard;
exports.MultipartFormGuard = MultipartFormGuard = __decorate([
    (0, common_1.Injectable)()
], MultipartFormGuard);
//# sourceMappingURL=multipart.form.guard.js.map