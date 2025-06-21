import { IsString, IsEmail, IsDateString, IsNotEmpty,IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { Expose } from 'class-transformer';


export class UpdateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required and cannot be empty or blank' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
   @Expose()
  name: string;

  @Expose()
    get isUser(): boolean {
    return !!(this.name && this.name.trim() !== '');
  }

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required and cannot be empty or blank' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
   @Expose()
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Mobile is required and cannot be empty or blank' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
   @Expose()
  mobile: string;

  @IsDateString({}, { message: 'Date of birth must be a valid date string' })
   @Expose()
  dob: string;

  @IsString()
   @Expose()
  profilePicture: string;

  
  @IsOptional()
  @IsString()
  otp: string;

  
  @IsOptional()
  @IsDateString()
  otpExpiresAt: string;

  
  @IsOptional()
  @IsString()
  refreshToken: string;

  
  @IsOptional()
  @IsString()
   @Expose()
  country: string;

  
  @IsOptional()
  @IsString()
   @Expose()
  state: string;

  @IsString()
   @Expose()
  address: string;

  @IsString()
   @Expose()
  bio: string;
}
