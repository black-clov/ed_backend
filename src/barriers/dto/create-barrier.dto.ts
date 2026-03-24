import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateBarrierDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsArray()
  @IsString({ each: true })
  barriers!: string[];
}
