"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LoggingInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let LoggingInterceptor = LoggingInterceptor_1 = class LoggingInterceptor {
    logger = new common_1.Logger(LoggingInterceptor_1.name);
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const method = req.method;
        const url = req.url;
        const now = Date.now();
        return next.handle().pipe((0, rxjs_1.tap)((data) => {
            this.logger.log(`✅ ${method} ${url} - ${Date.now() - now}ms - Success - Response: ${JSON.stringify(data)}`);
        }), (0, rxjs_1.catchError)((err) => {
            const statusCode = err?.status || 500;
            const message = err?.response?.message || err?.message || 'Internal server error';
            this.logger.error(`❌ ${method} ${url} - ${Date.now() - now}ms - Failed - Status: ${statusCode} - Error: ${JSON.stringify(message)}`);
            return (0, rxjs_1.throwError)(() => err);
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = LoggingInterceptor_1 = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map