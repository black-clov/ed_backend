import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateEntBarrierDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsArray()
  @IsString({ each: true })
  barriers!: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}
