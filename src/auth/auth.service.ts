import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(
		private readonly usersService: UsersService,
		private readonly configService: ConfigService,
		private readonly mailService: MailService,
	) {}

	async validateUser(email: string, pass: string): Promise<any> {
		const user = await this.usersService.findByEmail(email);
		if (user && user.passwordHash) {
			const match = await bcrypt.compare(pass, user.passwordHash);
			if (match) {
				const { passwordHash, resetToken, resetTokenExpires, ...result } = user;
				return result;
			}
		}
		return null;
	}

	async login(dto: { email?: string; password?: string }) {
		const email = dto.email || '';
		const password = dto.password || '';
		if (!email) {
			throw new UnauthorizedException('Email is required');
		}
		const user = await this.validateUser(email, password);
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}
		return { ok: true, message: 'Login successful', user };
	}

	async requestPasswordReset(email: string) {
		// 6-digit numeric code — easy to type from the email into the app.
		const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
		const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
		const result = await this.usersService.setResetToken(email, code, expires);

		// Always return the same generic response so callers cannot tell whether
		// the email is registered. The code is delivered ONLY via email — never
		// returned in the API response.
		if (result) {
			await this.mailService.sendPasswordResetCode(email, code);
		}
		return {
			ok: true,
			message: 'إذا كان البريد الإلكتروني مسجل، سيتم إرسال رمز إعادة التعيين إليه',
		};
	}

	async resetPassword(token: string, newPassword: string) {
		const user = await this.usersService.findByResetToken(token);
		if (!user) {
			throw new BadRequestException('رابط إعادة التعيين غير صالح أو منتهي الصلاحية');
		}
		const hash = await bcrypt.hash(newPassword, 10);
		await this.usersService.updatePassword(user.id, hash);
		return { ok: true, message: 'تم تغيير كلمة المرور بنجاح' };
	}

	async changePassword(userId: string, currentPassword: string, newPassword: string) {
		const valid = await this.usersService.validatePassword(userId, currentPassword);
		if (!valid) {
			throw new UnauthorizedException('كلمة المرور الحالية غير صحيحة');
		}
		const hash = await bcrypt.hash(newPassword, 10);
		await this.usersService.updatePassword(userId, hash);
		return { ok: true, message: 'تم تغيير كلمة المرور بنجاح' };
	}

	async verifyGoogleToken(idToken: string): Promise<{
		sub: string;
		email: string;
		given_name?: string;
		family_name?: string;
		picture?: string;
	}> {
		try {
			this.logger.log(`[GoogleAuth] received idToken length=${idToken?.length ?? 0}`);
			// Verify the token with Google's tokeninfo endpoint
			const response = await fetch(
				`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
			);
			if (!response.ok) {
				const bodyText = await response.text().catch(() => '');
				this.logger.warn(`[GoogleAuth] tokeninfo failed status=${response.status} body=${bodyText}`);
				throw new UnauthorizedException('Invalid Google token');
			}
			const payload = await response.json();

			// Verify the audience matches our client ID
			const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
			this.logger.log(`[GoogleAuth] token.aud=${payload.aud} expected(GOOGLE_CLIENT_ID)=${clientId ?? '(unset)'} email=${payload.email ?? '(none)'}`);
			if (clientId && payload.aud !== clientId) {
				this.logger.warn(`[GoogleAuth] AUDIENCE MISMATCH: token.aud=${payload.aud} != GOOGLE_CLIENT_ID=${clientId}`);
				throw new UnauthorizedException('Token audience mismatch');
			}

			if (!payload.email) {
				throw new UnauthorizedException('Google token missing email');
			}

			return {
				sub: payload.sub,
				email: payload.email,
				given_name: payload.given_name,
				family_name: payload.family_name,
				picture: payload.picture,
			};
		} catch (error) {
			if (error instanceof UnauthorizedException) throw error;
			throw new UnauthorizedException('Failed to verify Google token');
		}
	}
}
