import { IsEmail, IsNotEmpty, IsString, Matches, Length } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsNotEmpty({ message: 'Date of birth is required' })
  @IsString({ message: 'Date of birth must be a string' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'DOB must be in YYYY-MM-DD format' })
  dob: string;

  @IsNotEmpty({ message: 'Mobile number is required' })
  @Matches(/^\d{10}$/, { message: 'Mobile number must be 10 digits' })
  mobile: string;
}