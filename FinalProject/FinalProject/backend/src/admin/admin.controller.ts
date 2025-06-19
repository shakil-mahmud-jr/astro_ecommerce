import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Res } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { AdminService } from './admin.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { Response } from 'express';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('reports/export')
  async exportReport(@Res() res: Response) {
    const report = await this.adminService.generateReport();
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=dashboard-report-${new Date().toISOString().split('T')[0]}.csv`);
    
    return res.send(report);
  }

  @Get('customers')
  async getCustomers() {
    return this.adminService.getCustomersWithStats();
  }

  @Post('customers')
  async createCustomer(@Body() createUserDto: CreateUserDto) {
    return this.adminService.createCustomer(createUserDto);
  }

  @Patch('customers/:id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.adminService.updateCustomer(id, updateUserDto);
  }

  @Delete('customers/:id')
  async deleteCustomer(@Param('id') id: string) {
    return this.adminService.deleteCustomer(id);
  }

  @Get('sellers')
  async getSellers() {
    return this.adminService.getSellers();
  }

  @Get('sellers/pending')
  async getPendingSellers() {
    return this.adminService.getPendingSellers();
  }

  @Patch('sellers/:id/verify')
  async verifySeller(@Param('id') id: string) {
    return this.adminService.verifySeller(id);
  }

  @Patch('sellers/:id/reject')
  async rejectSeller(@Param('id') id: string) {
    return this.adminService.rejectSeller(id);
  }
} 