import { IsOptional, IsString } from 'class-validator';

export class GetVideosDto {
  @IsOptional()
  @IsString()
  category?: string;
}
