import { Body, Controller, Delete, ForbiddenException, Get, Logger, Param, Patch, Post, Put, Req, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import type { Request, Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UsersService } from './users.service';
import { Public } from '../auth/public.decorator';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  /** The authenticated user's own gender (mascot) and chosen track. */
  @Get('me/preferences')
  getMyPreferences(@Req() req: Request) {
    return this.usersService.getPreferences((req as any).user?.sub as string);
  }

  @Patch('me/preferences')
  updateMyPreferences(@Req() req: Request, @Body() dto: UpdatePreferencesDto) {
    return this.usersService.updatePreferences((req as any).user?.sub as string, dto);
  }

  /**
   * Only the account owner or an admin may read/edit a profile by id.
   * (Before this check any logged-in user could read or modify any profile.)
   */
  private assertSelfOrAdmin(req: Request, id: string) {
    const user = (req as any).user as { sub?: string; role?: string } | undefined;
    if (!user || (user.sub !== id && user.role !== 'admin')) {
      throw new ForbiddenException('You can only access your own account');
    }
  }

  /** Full user list (emails, phones): admins only. */
  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    this.assertSelfOrAdmin(req, id);
    return await this.usersService.findOne(id);
  }

  @Public()
  @Post()
  async create(@Body() dto: CreateUserDto, @Res() res: Response) {
    // Never log the request body: it contains the password in clear text.
    try {
      const user = await this.usersService.create(dto);
      this.logger.log(`User registered: ${user.id}`);
      return res.status(HttpStatus.CREATED).json(user);
    } catch (err: any) {
      if (err.status === 409) {
        // Expected case (email already used): a warning, not an error.
        this.logger.warn('Registration refused: email already registered');
        return res.status(HttpStatus.CONFLICT).json({ message: err.message });
      }
      this.logger.error(`Registration failed: ${err?.message ?? err}`);
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message || 'Registration failed' });
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto, @Req() req: Request) {
    this.assertSelfOrAdmin(req, id);
    return this.usersService.update(id, dto);
  }

  /**
   * Delete the currently authenticated user's own account and all their data.
   * Required by Google Play for apps that allow account creation.
   */
  @Delete('me')
  async deleteOwnAccount(@Req() req: Request) {
    const userId = (req as any).user?.sub as string;
    return this.usersService.deleteAccount(userId);
  }
}
