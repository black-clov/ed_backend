import { IsIn, IsOptional } from 'class-validator';

export const GENDERS = ['boy', 'girl'] as const;
export const TRACKS = ['employment', 'entrepreneurship', 'both'] as const;

export class UpdatePreferencesDto {
  @IsOptional()
  @IsIn(GENDERS)
  gender?: (typeof GENDERS)[number];

  @IsOptional()
  @IsIn(TRACKS)
  track?: (typeof TRACKS)[number];
}
