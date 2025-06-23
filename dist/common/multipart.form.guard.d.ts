import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class MultipartFormGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
