import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UpdateAboutDto } from './dto/about.dto';

export interface AboutContent {
  descriptionFr: string;
  descriptionAr: string;
  contactEmail: string;
  contactPhone: string;
  links: { label: string; url: string }[];
}

const EMPTY_ABOUT: AboutContent = {
  descriptionFr: '',
  descriptionAr: '',
  contactEmail: '',
  contactPhone: '',
  links: [],
};

/**
 * Small key/value store for app-wide settings editable from the admin panel.
 * Uses raw SQL on a dedicated table so it works with TYPEORM_SYNC off and no
 * migration step on deploy (same approach as recommendation_items).
 */
@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.dataSource.query(`
        CREATE TABLE IF NOT EXISTS "app_settings" (
          "key" varchar(100) PRIMARY KEY,
          "value" jsonb NOT NULL,
          "updated_at" TIMESTAMP NOT NULL DEFAULT now()
        )
      `);
    } catch {
      // Non-fatal: table is expected to exist already if DDL is not allowed.
    }
  }

  private async get<T>(key: string): Promise<T | null> {
    const rows = await this.dataSource.query(
      `SELECT "value" FROM "app_settings" WHERE "key" = $1`,
      [key],
    );
    return rows.length ? (rows[0].value as T) : null;
  }

  private async set(key: string, value: unknown): Promise<void> {
    await this.dataSource.query(
      `INSERT INTO "app_settings" ("key", "value", "updated_at")
       VALUES ($1, $2::jsonb, now())
       ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updated_at" = now()`,
      [key, JSON.stringify(value)],
    );
  }

  async getAbout(): Promise<AboutContent> {
    const stored = await this.get<Partial<AboutContent>>('about');
    return { ...EMPTY_ABOUT, ...(stored ?? {}) };
  }

  async updateAbout(dto: UpdateAboutDto): Promise<AboutContent> {
    const current = await this.getAbout();
    const next: AboutContent = {
      descriptionFr: dto.descriptionFr ?? current.descriptionFr,
      descriptionAr: dto.descriptionAr ?? current.descriptionAr,
      contactEmail: dto.contactEmail ?? current.contactEmail,
      contactPhone: dto.contactPhone ?? current.contactPhone,
      links: dto.links
        ? dto.links.map((l) => ({ label: l.label.trim(), url: l.url.trim() }))
        : current.links,
    };
    await this.set('about', next);
    return next;
  }
}
