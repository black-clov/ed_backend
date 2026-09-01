import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { existsSync } from 'fs';
import { GenerateCvDto } from './dto/generate-cv.dto';
import { UsersService } from '../users/users.service';
import { SkillsService } from '../skills/skills.service';
import { QuestionnaireService } from '../questionnaire/questionnaire.service';
import PDFDocument = require('pdfkit');

const BRAND = '#C62828';
const BRAND_LIGHT = '#FFEBEE';
const TEXT = '#333333';
const MUTED = '#999999';

// Amiri Arabic font (shaped + RTL) shipped under backend/assets/fonts.
const FONT_AR = join(process.cwd(), 'assets', 'fonts', 'Amiri-Regular.ttf');
const FONT_AR_BOLD = join(process.cwd(), 'assets', 'fonts', 'Amiri-Bold.ttf');

const LABELS = {
  fr: {
    headline: "Jeune à la recherche d'opportunités professionnelles",
    fallbackName: 'Utilisateur Eidmaj',
    contact: 'Coordonnées',
    email: 'E-mail',
    phone: 'Téléphone',
    city: 'Ville',
    level: "Niveau d'études",
    skills: 'Compétences',
    interests: "Centres d'intérêt",
    prefs: 'Préférences de travail',
    footer: "Généré par l'application Eidmaj",
  },
  ar: {
    headline: 'شاب(ة) باحث(ة) عن فرص مهنية',
    fallbackName: 'مستخدم إدماج',
    contact: 'معلومات الاتصال',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    city: 'المدينة',
    level: 'المستوى الدراسي',
    skills: 'المهارات',
    interests: 'الاهتمامات',
    prefs: 'تفضيلات العمل',
    footer: 'تم إنشاؤه بواسطة تطبيق إدماج',
  },
};

@Injectable()
export class CvService {
  constructor(
    private readonly usersService: UsersService,
    private readonly skillsService: SkillsService,
    private readonly questionnaireService: QuestionnaireService,
  ) {}

  async generate(dto: GenerateCvDto) {
    const userId = dto.userId ?? 'anonymous';
    const profile = await this.usersService.getProfile(userId);
    const skills = await this.skillsService.getUserSkills(userId);
    const answers = await this.questionnaireService.getLatestAnswers(userId);

    return {
      userId,
      profile,
      headline: dto.headline ?? 'شاب(ة) باحث(ة) عن فرص مهنية',
      sections: {
        skills,
        interests: answers?.interests ?? [],
        workPreferences: answers?.workPreferences ?? [],
      },
      note: 'JSON CV generated. Use POST /cv/pdf for PDF export.',
    };
  }

  async generatePdf(dto: GenerateCvDto): Promise<Buffer> {
    const userId = dto.userId ?? 'anonymous';
    const profile = await this.usersService.getProfile(userId);
    const skills = await this.skillsService.getUserSkills(userId);
    const answers = await this.questionnaireService.getLatestAnswers(userId);

    // Default to Arabic today (the app is Arabic); the frontend will pass the
    // chosen language explicitly once the FR/AR switch is in place.
    const lang: 'fr' | 'ar' = dto.lang === 'fr' ? 'fr' : 'ar';
    const rtl = lang === 'ar';
    const t = LABELS[lang];
    // Use the embedded Arabic font for AR (proper shaping + RTL); Helvetica for FR.
    const hasArFont = existsSync(FONT_AR);
    const bodyFont = rtl && hasArFont ? 'body' : 'Helvetica';
    const boldFont = rtl && hasArFont ? 'bold' : 'Helvetica-Bold';

    const fullName = profile
      ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() || t.fallbackName
      : t.fallbackName;
    const headline = dto.headline ?? t.headline;

    const pageW = 595.28;
    const margin = 50;
    const align: 'left' | 'right' = rtl ? 'right' : 'left';
    const textOpts = { width: pageW - margin * 2, align } as const;

    return new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin });
      if (rtl && hasArFont) {
        doc.registerFont('body', FONT_AR);
        doc.registerFont('bold', existsSync(FONT_AR_BOLD) ? FONT_AR_BOLD : FONT_AR);
      }
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err: Error) => reject(err));

      // Header (brand red)
      doc.rect(0, 0, pageW, 100).fill(BRAND);
      doc.font(boldFont).fontSize(26).fillColor('#FFFFFF')
        .text(fullName, margin, 28, textOpts);
      doc.font(bodyFont).fontSize(12).fillColor(BRAND_LIGHT)
        .text(headline, margin, 66, textOpts);

      let y = 120;
      const line = (text: string, opts: { bold?: boolean; size?: number; color?: string; indent?: number } = {}) => {
        doc.font(opts.bold ? boldFont : bodyFont)
          .fontSize(opts.size ?? 11)
          .fillColor(opts.color ?? TEXT)
          .text(text, margin + (opts.indent ?? 0), y, { width: pageW - margin * 2 - (opts.indent ?? 0), align });
        y += (opts.size ?? 11) + 7;
      };

      const section = (title: string) => {
        y += 6;
        doc.font(boldFont).fontSize(14).fillColor(BRAND).text(title, margin, y, textOpts);
        y += 20;
        doc.moveTo(margin, y).lineTo(pageW - margin, y).strokeColor(BRAND).lineWidth(1).stroke();
        y += 10;
      };

      // Contact
      if (profile) {
        section(t.contact);
        if (profile.email) line(`${t.email}: ${profile.email}`);
        if (profile.telephone) line(`${t.phone}: ${profile.telephone}`);
        if (profile.ville) line(`${t.city}: ${profile.ville}`);
        if (profile.niveau_scolaire) line(`${t.level}: ${profile.niveau_scolaire}`);
      }

      // Skills
      if (skills.length > 0) {
        section(t.skills);
        for (const skill of skills) line(`•  ${skill}`, { indent: 10 });
      }

      // Interests
      const interests = answers?.interests ?? [];
      if (interests.length > 0) {
        section(t.interests);
        line(interests.join('  -  '), { indent: 10 });
      }

      // Work preferences
      const prefs = answers?.workPreferences ?? [];
      if (prefs.length > 0) {
        section(t.prefs);
        line(prefs.join('  -  '), { indent: 10 });
      }

      // Footer
      doc.font(bodyFont).fontSize(9).fillColor(MUTED)
        .text(t.footer, margin, doc.page.height - 40, { width: pageW - margin * 2, align: 'center' });

      doc.end();
    });
  }
}
