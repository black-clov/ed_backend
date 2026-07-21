import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;
  private initialized = false;

  constructor(private readonly config: ConfigService) {}

  /** Lazily build the SMTP transporter from environment configuration. */
  private getTransporter(): Transporter | null {
    if (this.initialized) return this.transporter;
    this.initialized = true;

    const host = this.config.get<string>('SMTP_HOST');
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');

    if (!host || !user || !pass) {
      this.logger.warn(
        'SMTP is not configured (SMTP_HOST/SMTP_USER/SMTP_PASS missing). ' +
          'Emails will be logged to the console instead of being sent.',
      );
      this.transporter = null;
      return null;
    }

    const port = this.config.get<number>('SMTP_PORT', 587);
    this.transporter = nodemailer.createTransport({
      host,
      port,
      // Port 465 uses implicit TLS; 587/others use STARTTLS.
      secure: this.config.get<string>('SMTP_SECURE', 'false') === 'true' || port === 465,
      auth: { user, pass },
    });
    return this.transporter;
  }

  private get from(): string {
    return this.config.get<string>('SMTP_FROM', 'Eidmaj <no-reply@eidmaj.ma>');
  }

  /**
   * Send the password-reset code. Never returns/exposes the code to the API
   * caller — it only reaches the user's inbox.
   */
  async sendPasswordResetCode(to: string, code: string): Promise<void> {
    const transporter = this.getTransporter();

    if (!transporter) {
      // Dev fallback: log so local testing still works, without leaking to the client.
      this.logger.log(`[DEV] Password reset code for ${to}: ${code}`);
      return;
    }

    const html = `
      <div dir="rtl" style="font-family:Arial,sans-serif;background:#faf6f0;padding:24px;color:#3e2723">
        <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;padding:28px;text-align:center">
          <h2 style="color:#e65100;margin:0 0 8px">استعادة كلمة المرور</h2>
          <p style="font-size:15px;line-height:1.7">
            هذا هو رمز إعادة تعيين كلمة المرور الخاص بك. أدخله في التطبيق لإكمال العملية:
          </p>
          <div style="font-size:34px;font-weight:bold;letter-spacing:8px;color:#e65100;
                      background:#fff3e0;border-radius:12px;padding:16px;margin:20px 0;direction:ltr">
            ${code}
          </div>
          <p style="font-size:13px;color:#8d6e63">
            هذا الرمز صالح لمدة ساعة واحدة. إذا لم تطلب إعادة التعيين، تجاهل هذه الرسالة.
          </p>
        </div>
      </div>`;

    try {
      await transporter.sendMail({
        from: this.from,
        to,
        subject: 'رمز إعادة تعيين كلمة المرور - Eidmaj',
        text: `رمز إعادة تعيين كلمة المرور الخاص بك هو: ${code}\nهذا الرمز صالح لمدة ساعة واحدة.`,
        html,
      });
    } catch (err) {
      // Log but don't surface details to the client (avoids leaking whether the address exists).
      this.logger.error(`Failed to send reset email to ${to}`, err as Error);
    }
  }
}
