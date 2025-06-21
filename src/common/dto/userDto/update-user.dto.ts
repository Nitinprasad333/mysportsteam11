import { IsOptional, IsString, IsEmail, IsDateString,IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
    @IsNotEmpty({ message: 'Name is required and cannot be empty' })
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDateString()
  
  dob?: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsString()
  otp?: string;

  @IsOptional()
  @IsDateString()
  otpExpiresAt?: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;


//   @IsOptional()
//   @IsString()
//   profilePicture?: string;


    @IsOptional()
  @IsString()
  country?: string;


    @IsOptional()
  @IsString()
  state?: string;


  
    @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}