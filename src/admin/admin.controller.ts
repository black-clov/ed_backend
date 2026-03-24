import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AdminService } from './admin.service';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('admin')
@UseGuards(RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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
}
