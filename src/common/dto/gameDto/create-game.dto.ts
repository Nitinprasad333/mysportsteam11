import { IsString,IsNotEmpty } from 'class-validator';

export class CreateGameDto {

 @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
    name: string;


  @IsString()
  description: string;
}