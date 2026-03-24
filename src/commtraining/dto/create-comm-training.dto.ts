import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateCommTrainingDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsArray()
  @IsString({ each: true })
  skills!: string[];

  @IsOptional()
  @IsObject()
  ratings?: Record<string, number>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  completedModules?: string[];
}
