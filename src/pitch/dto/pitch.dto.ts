import { IsOptional, IsString } from 'class-validator';

export class GeneratePitchDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  projectName!: string;

  @IsOptional()
  @IsString()
  sector?: string;
}

export class SavePitchDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  projectName!: string;

  @IsString()
  pitchText!: string;

  @IsOptional()
  @IsString()
  sector?: string;
}
