import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @IsString()
  @IsNotEmpty()
  last_name!: string;

  @IsOptional()
  @IsInt()
  age?: number;

  @IsOptional()
  @IsString()
  ville?: string;

  @IsOptional()
  @IsString()
  niveau_scolaire?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
