import {
  IsEmail,
  Matches,
  ValidateIf,
  IsOptional,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions
} from 'class-validator';

// Custom class-level validator to check at least one of email or mobile is provided
@ValidatorConstraint({ name: 'EitherEmailOrMobile', async: false })
class EitherEmailOrMobileConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as any;
    return !!(obj.email || obj.mobile); // At least one must be present
  }

  defaultMessage(args: ValidationArguments) {
    return 'Either email or mobile number must be provided';
  }
}

function EitherEmailOrMobile(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'EitherEmailOrMobile',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: EitherEmailOrMobileConstraint,
    });
  };
}

export class newRegisterDto {
  @ValidateIf(o => o.email !== undefined)
  @IsEmail({}, { message: 'Email must be valid' })
  email?: string;

  @ValidateIf(o => o.mobile !== undefined)
  @Matches(/^\d{10}$/, { message: 'Mobile number must be 10 digits' })
  mobile?: string;

  @EitherEmailOrMobile({ message: 'Either email or mobile number must be provided' })
  dummyField: string; // this dummy field is needed to attach the class-level validator
}
