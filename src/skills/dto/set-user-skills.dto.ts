import { IsArray, IsOptional, IsString } from 'class-validator';

export class SetUserSkillsDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsArray()
  @IsString({ each: true })
  skills!: string[];
}
