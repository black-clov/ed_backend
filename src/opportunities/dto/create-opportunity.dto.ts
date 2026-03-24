import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateOpportunityDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsIn(['job', 'internship', 'training'])
  type!: 'job' | 'internship' | 'training';

  @IsString()
  @IsNotEmpty()
  location!: string;
}
