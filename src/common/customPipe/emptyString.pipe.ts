import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class EmptyStringToUndefinedPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value && typeof value === 'object') {
      for (const key in value) {
        if (value[key] === '') {
          value[key] = undefined;
        }
      }
    }
    return value;
  }
}
