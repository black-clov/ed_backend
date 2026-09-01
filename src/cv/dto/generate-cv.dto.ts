import { IsIn, IsOptional, IsString } from 'class-validator';

export class GenerateCvDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  headline?: string;

  /** Output language of the CV: 'fr' (default) or 'ar'. */
  @IsOptional()
  @IsIn(['fr', 'ar'])
  lang?: 'fr' | 'ar';
}
