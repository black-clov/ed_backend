import { IsNotEmpty, IsString } from 'class-validator';

export class CreateInterviewSessionDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  targetRole!: string;

  @IsString()
  @IsNotEmpty()
  scheduledAt!: string;
}
