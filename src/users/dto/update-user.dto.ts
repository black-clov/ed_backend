import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

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

  @IsOptional()
  @IsEmail()
  email?: string;
}
