import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class EmptyStringToUndefinedPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
}
