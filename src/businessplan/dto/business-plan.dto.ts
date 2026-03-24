import { IsOptional, IsString } from 'class-validator';

export class CreateBusinessPlanDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  projectName!: string;

  @IsOptional()
  @IsString()
  sector?: string;
}

export class SaveBusinessPlanDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  projectName!: string;

  @IsString()
  description!: string;

  @IsString()
  valueProposition!: string;

  @IsString()
  targetCustomers!: string;

  @IsString()
  costs!: string;

  @IsString()
  firstSteps!: string;

  @IsOptional()
  @IsString()
  sector?: string;
}
