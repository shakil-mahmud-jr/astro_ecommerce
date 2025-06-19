import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Category } from '../categories/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['category']
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category']
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryId, ...productData } = createProductDto;

    // Check if category exists
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId }
    });
    if (!category) {
      throw new BadRequestException(`Category with ID ${categoryId} not found`);
    }

    // Check if SKU is unique
    const existingProduct = await this.productsRepository.findOne({
      where: { sku: productData.sku }
    });
    if (existingProduct) {
      throw new BadRequestException(`Product with SKU ${productData.sku} already exists`);
    }

    try {
      const product = this.productsRepository.create({
        ...productData,
        category,
        isActive: productData.isActive ?? true
      });
      return await this.productsRepository.save(product);
    } catch (error) {
      throw new BadRequestException('Failed to create product: ' + error.message);
    }
  }

  async update(id: string, updateProductDto: Partial<CreateProductDto>): Promise<Product> {
    const product = await this.findOne(id);
    const { categoryId, ...updateData } = updateProductDto;

    if (categoryId) {
      const category = await this.categoriesRepository.findOne({
        where: { id: categoryId }
      });
      if (!category) {
        throw new BadRequestException(`Category with ID ${categoryId} not found`);
      }
      product.category = category;
    }

    if (updateData.sku && updateData.sku !== product.sku) {
      const existingProduct = await this.productsRepository.findOne({
        where: { sku: updateData.sku }
      });
      if (existingProduct) {
        throw new BadRequestException(`Product with SKU ${updateData.sku} already exists`);
      }
    }

    try {
      Object.assign(product, updateData);
      return await this.productsRepository.save(product);
    } catch (error) {
      throw new BadRequestException('Failed to update product: ' + error.message);
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    const newStock = product.stock + quantity;
    
    if (newStock < 0) {
      throw new BadRequestException('Stock cannot be negative');
    }
    
    product.stock = newStock;
    return this.productsRepository.save(product);
  }
} 