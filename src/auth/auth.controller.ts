import { Body, Controller, Get, Post, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Public } from './public.decorator';
import { RequestResetDto, ResetPasswordDto, ChangePasswordDto } from './dto/password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Get('test')
  test() {
    return { message: 'Backend works!' };
  }

  @Public()
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
  @Post('request-reset')
  async requestReset(@Body() dto: RequestResetDto) {
    return this.authService.requestPasswordReset(dto.email);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @Post('change-password')
  async changePassword(@Body() dto: ChangePasswordDto, @Req() req: any) {
    const userId = req.user.sub;
    return this.authService.changePassword(userId, dto.currentPassword, dto.newPassword);
  }
}