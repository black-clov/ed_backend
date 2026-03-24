import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateEntrepreneurshipDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsArray()
  @IsString({ each: true })
  skills!: string[];

  @IsOptional()
  @IsObject()
  ratings?: Record<string, number>;
}
