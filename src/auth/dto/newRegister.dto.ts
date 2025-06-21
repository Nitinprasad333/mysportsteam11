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
  ValidationOptions,
  IsNotEmpty,
} from 'class-validator';

// Class-level validator to ensure at least one of email or mobile is provided
@ValidatorConstraint({ name: 'EitherEmailOrMobile', async: false })
class EitherEmailOrMobileConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as any;
    return !!(obj.email?.trim() || obj.mobile?.trim()); // must not be empty/blank
  }

  defaultMessage(args: ValidationArguments) {
    return 'Either email or mobile number must be provided and cannot be blank';
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
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Email must be valid' })
  email?: string;

  @ValidateIf(o => o.mobile !== undefined)
  @IsNotEmpty({ message: 'Mobile number cannot be empty' })
  @Matches(/^\d{10}$/, { message: 'Mobile number must be 10 digits' })
  mobile?: string;

  @EitherEmailOrMobile({ message: 'Either email or mobile number must be provided and cannot be blank' })
  dummyField: string;
}
