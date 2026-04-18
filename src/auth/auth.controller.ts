import { Body, Controller, Get, Post, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Throttle } from '@nestjs/throttler';
import { Public } from './public.decorator';
import { RequestResetDto, ResetPasswordDto, ChangePasswordDto } from './dto/password.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Get('test')
  test() {
    return { message: 'Backend works!' };
  }

  @Public()
  @Throttle([{ ttl: 60000, limit: 5 }])
  @Post('login')
  async login(@Body() dto: { email?: string; password?: string }) {
    const user = await this.authService.validateUser(dto.email || '', dto.password || '');
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload);
    return { access_token, userId: user.id, role: user.role };
  }

  @Public()
  @Throttle([{ ttl: 60000, limit: 3 }])
  @Post('request-reset')
  async requestReset(@Body() dto: RequestResetDto) {
    return this.authService.requestPasswordReset(dto.email);
  }

  @Public()
  @Throttle([{ ttl: 60000, limit: 5 }])
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @Post('change-password')
  async changePassword(@Body() dto: ChangePasswordDto, @Req() req: any) {
    const userId = req.user.sub;
    return this.authService.changePassword(userId, dto.currentPassword, dto.newPassword);
  }

  @Public()
  @Throttle([{ ttl: 60000, limit: 10 }])
  @Post('google')
  async googleLogin(@Body() dto: { idToken: string }) {
    if (!dto.idToken) {
      throw new UnauthorizedException('Google ID token is required');
    }
    // Verify Google ID token
    const googleUser = await this.authService.verifyGoogleToken(dto.idToken);
    // Find or create user
    const user = await this.usersService.findOrCreateGoogleUser({
      googleId: googleUser.sub,
      email: googleUser.email,
      firstName: googleUser.given_name || '',
      lastName: googleUser.family_name || '',
      avatarUrl: googleUser.picture || undefined,
    });
    // Issue JWT
    const payload = { email: user.email, sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload);
    return { access_token, userId: user.id, role: user.role };
  }
}