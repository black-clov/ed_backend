import { IsOptional, IsString } from 'class-validator';

export class GenerateCvDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  headline?: string;
}
