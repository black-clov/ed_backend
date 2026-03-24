import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateProgramDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsIn(['incubator', 'association', 'training program', 'funding program'])
  category!: 'incubator' | 'association' | 'training program' | 'funding program';
}
