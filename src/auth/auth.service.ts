import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
	constructor(private readonly usersService: UsersService) {}

	async validateUser(email: string, pass: string): Promise<any> {
		const user = await this.usersService.findByEmail(email);
		if (user) {
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
		const token = crypto.randomBytes(32).toString('hex');
		const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
		const result = await this.usersService.setResetToken(email, token, expires);
		if (!result) {
			// Don't reveal if email exists or not
			return { ok: true, message: 'إذا كان البريد الإلكتروني مسجل، سيتم إرسال رابط إعادة التعيين' };
		}
		// In production, send email here. For now, return token directly for testing.
		return { ok: true, message: 'رابط إعادة التعيين جاهز', resetToken: token };
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
}
