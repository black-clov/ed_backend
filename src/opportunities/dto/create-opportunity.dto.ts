import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOpportunityDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsIn(['job', 'internship', 'training'])
  type!: 'job' | 'internship' | 'training';

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredSkills?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  suitableForNeeds?: string[];
}

export class UpdateOpportunityDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsIn(['job', 'internship', 'training'])
  type?: 'job' | 'internship' | 'training';

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredSkills?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  suitableForNeeds?: string[];
}
