import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { slugify } from '../utils/slugify';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Category)
    private categoryTreeRepository: TreeRepository<Category>
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({
      relations: ['products', 'children', 'parent'],
      where: { isActive: true },
      order: { displayOrder: 'ASC', name: 'ASC' }
    });
  }

  async findAllTree(): Promise<Category[]> {
    return this.categoryTreeRepository.findTrees();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['products', 'children', 'parent']
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { slug, isActive: true },
      relations: ['products', 'children', 'parent']
    });
    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    this.logger.log(`Attempting to create category with data: ${JSON.stringify(createCategoryDto)}`);
    
    const { parentCategoryId, ...categoryData } = createCategoryDto;
    
    // Generate slug if not provided
    if (!categoryData.slug) {
      categoryData.slug = slugify(categoryData.name);
      this.logger.log(`Generated slug: ${categoryData.slug}`);
    }
    
    // Check if slug exists
    const existingCategory = await this.categoriesRepository.findOne({
      where: { slug: categoryData.slug }
    });
    
    if (existingCategory) {
      this.logger.error(`Category with slug ${categoryData.slug} already exists`);
      throw new ConflictException(`Category with slug ${categoryData.slug} already exists`);
    }

    try {
      const category = this.categoriesRepository.create(categoryData);
      
      if (parentCategoryId) {
        this.logger.log(`Finding parent category with ID: ${parentCategoryId}`);
        const parent = await this.findOne(parentCategoryId);
        category.parent = parent;
      }

      const savedCategory = await this.categoriesRepository.save(category);
      this.logger.log(`Successfully created category with ID: ${savedCategory.id}`);
      return savedCategory;
    } catch (error) {
      this.logger.error(`Error creating category: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, categoryData: Partial<Category>): Promise<Category> {
    const category = await this.findOne(id);

    // If slug is being updated, check for uniqueness
    if (categoryData.slug && categoryData.slug !== category.slug) {
      const existingCategory = await this.categoriesRepository.findOne({
        where: { slug: categoryData.slug }
      });
      if (existingCategory) {
        throw new ConflictException(`Category with slug ${categoryData.slug} already exists`);
      }
    }

    // Update the category
    await this.categoriesRepository.update(id, categoryData);
    return this.findOne(id);
  }

  async updateProductCount(id: string): Promise<void> {
    const category = await this.findOne(id);
    const productCount = await this.categoriesRepository
      .createQueryBuilder('category')
      .leftJoin('category.products', 'product')
      .where('category.id = :id', { id })
      .andWhere('product.isActive = :isActive', { isActive: true })
      .getCount();

    await this.categoriesRepository.update(id, { productCount });
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    
    // Check if category has products
    if (category.products?.length > 0) {
      throw new ConflictException(`Cannot delete category with existing products`);
    }

    // Check if category has children
    if (category.children?.length > 0) {
      throw new ConflictException(`Cannot delete category with child categories`);
    }

    const result = await this.categoriesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }

  async toggleActive(id: string): Promise<Category> {
    const category = await this.findOne(id);
    category.isActive = !category.isActive;
    return this.categoriesRepository.save(category);
  }

  async updateOrder(id: string, displayOrder: number): Promise<Category> {
    const category = await this.findOne(id);
    category.displayOrder = displayOrder;
    return this.categoriesRepository.save(category);
  }

  async search(query: string): Promise<Category[]> {
    return this.categoriesRepository
      .createQueryBuilder('category')
      .where('category.name ILIKE :query OR category.description ILIKE :query', {
        query: `%${query}%`
      })
      .andWhere('category.isActive = :isActive', { isActive: true })
      .orderBy('category.name', 'ASC')
      .getMany();
  }
} 