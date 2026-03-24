import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RequestResetDto {
  @IsEmail()
  email!: string;
}

export class ResetPasswordDto {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(6)
  newPassword!: string;
}

export class ChangePasswordDto {
  @IsString()
  currentPassword!: string;

  @IsString()
  @MinLength(6)
  newPassword!: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
