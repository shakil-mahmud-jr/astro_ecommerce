import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe, Logger, HttpStatus, HttpCode, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { TransformInterceptor } from '../interceptors/transform.interceptor';

@Controller('categories')
@UseInterceptors(TransformInterceptor)
export class CategoriesController {
  private readonly logger = new Logger(CategoriesController.name);

  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get('tree')
  findAllTree(): Promise<Category[]> {
    return this.categoriesService.findAllTree();
  }

  @Get('search')
  search(@Query('query') query: string): Promise<Category[]> {
    return this.categoriesService.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string): Promise<Category> {
    return this.categoriesService.findBySlug(slug);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    this.logger.log(`Received request to create category: ${JSON.stringify(createCategoryDto)}`);
    try {
      const category = await this.categoriesService.create(createCategoryDto);
      this.logger.log(`Successfully created category with ID: ${category.id}`);
      return category;
    } catch (error) {
      this.logger.error(`Failed to create category: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() categoryData: Partial<Category>): Promise<Category> {
    return this.categoriesService.update(id, categoryData);
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard, AdminGuard)
  toggleActive(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.toggleActive(id);
  }

  @Patch(':id/order')
  @UseGuards(JwtAuthGuard, AdminGuard)
  updateOrder(
    @Param('id') id: string,
    @Body('displayOrder', ParseIntPipe) displayOrder: number
  ): Promise<Category> {
    return this.categoriesService.updateOrder(id, displayOrder);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string): Promise<void> {
    return this.categoriesService.remove(id);
  }
} 