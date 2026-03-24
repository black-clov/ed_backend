import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateNeedsDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsArray()
  @IsString({ each: true })
  needs!: string[];
}
