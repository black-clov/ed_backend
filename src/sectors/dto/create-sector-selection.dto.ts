import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateSectorSelectionDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsArray()
  @IsString({ each: true })
  sectors!: string[];
}
