import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateSupportPreferenceDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsArray()
  @IsString({ each: true })
  preferences!: string[];

  @IsOptional()
  @IsObject()
  details?: Record<string, string>;
}
