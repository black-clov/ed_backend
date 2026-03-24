import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export class SubmitQuestionnaireAnswersDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsArray()
  @IsString({ each: true })
  interests!: string[];

  @IsOptional()
  @IsObject()
  interestCategories?: Record<string, string[]>;

  @IsObject()
  personalityAnswers!: Record<string, string>;

  @IsOptional()
  @IsObject()
  softSkillsAnswers?: Record<string, string>;

  @IsArray()
  @IsString({ each: true })
  workPreferences!: string[];
}
