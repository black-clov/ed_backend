import { IsObject } from 'class-validator';

export class SaveInterestsDto {
  /** { categoryId: [subItemId, ...] } — validated against the catalogue in the service. */
  @IsObject()
  selections!: Record<string, string[]>;
}
