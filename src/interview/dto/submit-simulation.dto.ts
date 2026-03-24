import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SimulationAnswerDto {
  @IsString()
  @IsNotEmpty()
  questionId!: string;

  @IsString()
  @IsNotEmpty()
  answer!: string;
}

export class SubmitSimulationDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  targetRole!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SimulationAnswerDto)
  answers!: SimulationAnswerDto[];
}
