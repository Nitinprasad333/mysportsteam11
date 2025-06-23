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
exports.ContentTypeInterceptor = void 0;
const common_1 = require("@nestjs/common");
const skip_content_type_decorator_1 = require("../utility/decorators/skip-content-type.decorator");
const core_1 = require("@nestjs/core");
let ContentTypeInterceptor = class ContentTypeInterceptor {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    intercept(context, next) {
        const isSkipped = this.reflector.getAllAndOverride(skip_content_type_decorator_1.SKIP_CONTENT_TYPE_CHECK, [context.getHandler(), context.getClass()]);
        if (isSkipped) {
            return next.handle();
        }
        const request = context.switchToHttp().getRequest();
        if (['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
            const contentType = request.headers['content-type'];
            if (!contentType || !contentType.includes('application/json')) {
                throw new common_1.BadRequestException('Content-Type must be application/json');
            }
        }
        return next.handle();
    }
};
exports.ContentTypeInterceptor = ContentTypeInterceptor;
exports.ContentTypeInterceptor = ContentTypeInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], ContentTypeInterceptor);
//# sourceMappingURL=content-type.interceptor.js.map