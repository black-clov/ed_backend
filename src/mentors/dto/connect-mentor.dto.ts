import { IsNotEmpty, IsString } from 'class-validator';

export class ConnectMentorDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  mentorId!: string;
}
