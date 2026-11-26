import { IsObject } from 'class-validator';

export class SaveAnswersDto {
  /** { questionId: choiceId } — validated against the catalogue in the service. */
  @IsObject()
  answers!: Record<string, string>;
}
