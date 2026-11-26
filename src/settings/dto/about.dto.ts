import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class AboutLinkDto {
  @IsString()
  @MaxLength(80)
  label!: string;

  @IsUrl({ require_protocol: true, protocols: ['http', 'https'] })
  @MaxLength(1000)
  url!: string;
}

/** "À propos" page content, editable from the admin panel (FR + AR). */
export class UpdateAboutDto {
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  descriptionFr?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  descriptionAr?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  contactEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  contactPhone?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => AboutLinkDto)
  links?: AboutLinkDto[];
}
