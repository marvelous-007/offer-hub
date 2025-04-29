import { Controller, Get, UseGuards, SetMetadata } from '@nestjs/common';
import { RolesGuard } from '@/modules/auth/roles.guard';

@Controller('admin')
@UseGuards(RolesGuard)
@SetMetadata('roles', ['admin'])
export class AdminController {
  @Get()
  getAdminData() {
    return { message: 'This is admin-only data.' };
  }
}