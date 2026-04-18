import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AdminService } from './admin.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { VideosService } from '../videos/videos.service';
import { CreateVideoDto, UpdateVideoDto } from '../videos/dto/video-crud.dto';
import { ContentService } from '../content/content.service';
import { CreateContentDto, UpdateContentDto } from '../content/dto/content.dto';

@Controller('admin')
@UseGuards(RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly videosService: VideosService,
    private readonly contentService: ContentService,
  ) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  async getUsers() {
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id/role')
  async updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.adminService.updateUserRole(id, dto.role);
  }

  @Get('users/:id/details')
  async getUserDetails(@Param('id') id: string) {
    return this.adminService.getUserDetails(id);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Get('analytics')
  async getAnalytics(@Query('limit') limit?: number) {
    return this.adminService.getAnalytics(limit || 100);
  }

  @Get('analytics/user/:userId')
  async getUserAnalytics(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getUserAnalytics(userId, limit || 50);
  }

  // ── Video CRUD ──────────────────────────────────
  @Get('videos')
  async getVideos() {
    return this.videosService.findAllAdmin();
  }

  @Post('videos')
  async createVideo(@Body() dto: CreateVideoDto) {
    return this.videosService.create(dto);
  }

  @Put('videos/:id')
  async updateVideo(@Param('id') id: string, @Body() dto: UpdateVideoDto) {
    return this.videosService.update(id, dto);
  }

  @Delete('videos/:id')
  async deleteVideo(@Param('id') id: string) {
    await this.videosService.remove(id);
    return { ok: true };
  }

  // ── Content CRUD ────────────────────────────────
  @Get('content')
  async getContent() {
    return this.contentService.findAllAdmin();
  }

  @Post('content')
  async createContent(@Body() dto: CreateContentDto) {
    return this.contentService.create(dto);
  }

  @Put('content/:id')
  async updateContent(@Param('id') id: string, @Body() dto: UpdateContentDto) {
    return this.contentService.update(id, dto);
  }

  @Delete('content/:id')
  async deleteContent(@Param('id') id: string) {
    await this.contentService.remove(id);
    return { ok: true };
  }
}
