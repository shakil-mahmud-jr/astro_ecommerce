import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SellerGuard } from '../auth/seller.guard';
import { SellerService } from './seller.service';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from '../products/dto/update-product.dto';
import { UpdateSellerProfileDto } from './dto/update-seller-profile.dto';

@Controller('seller')
@UseGuards(JwtAuthGuard, SellerGuard)
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get('dashboard')
  async getDashboardStats(@Request() req) {
    return this.sellerService.getDashboardStats(req.user.id);
  }

  @Get('products')
  async getProducts(@Request() req) {
    return this.sellerService.getSellerProducts(req.user.id);
  }

  @Post('products')
  async createProduct(@Request() req, @Body() createProductDto: CreateProductDto) {
    return this.sellerService.createProduct(req.user.id, createProductDto);
  }

  @Patch('products/:id')
  async updateProduct(
    @Request() req,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.sellerService.updateProduct(req.user.id, id, updateProductDto);
  }

  @Delete('products/:id')
  async deleteProduct(@Request() req, @Param('id') id: string) {
    return this.sellerService.deleteProduct(req.user.id, id);
  }

  @Get('orders')
  async getOrders(@Request() req) {
    return this.sellerService.getSellerOrders(req.user.id);
  }

  @Get('profile')
  async getProfile(@Request() req) {
    return this.sellerService.getSellerProfile(req.user.id);
  }

  @Patch('profile')
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateSellerProfileDto
  ) {
    return this.sellerService.updateProfile(req.user.id, updateProfileDto);
  }
} 