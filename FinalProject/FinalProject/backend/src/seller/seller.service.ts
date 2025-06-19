import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { Order } from '../orders/order.entity';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from '../products/dto/update-product.dto';
import { UpdateSellerProfileDto } from './dto/update-seller-profile.dto';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>
  ) {}

  async getDashboardStats(sellerId: string) {
    const seller = await this.validateSeller(sellerId);
    
    try {
      // Get seller's products
      const products = await this.productsRepository.find({
        where: { seller: { id: sellerId } }
      });

      // Get orders containing seller's products
      const orders = await this.ordersRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.items', 'items')
        .leftJoinAndSelect('items.product', 'product')
        .where('product.sellerId = :sellerId', { sellerId })
        .orderBy('order.createdAt', 'DESC')
        .getMany();

      // Calculate statistics
      const totalProducts = products.length;
      const activeProducts = products.filter(p => p.isActive).length;
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => {
        const orderTotal = order.items
          .filter(item => item.product.sellerId === sellerId)
          .reduce((itemSum, item) => itemSum + item.price * item.quantity, 0);
        return sum + orderTotal;
      }, 0);

      return {
        totalProducts,
        activeProducts,
        totalOrders,
        totalRevenue,
        recentOrders: orders.slice(0, 5), // Last 5 orders
        products: products.slice(0, 5), // Last 5 products
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch dashboard statistics');
    }
  }

  async getSellerProducts(sellerId: string) {
    await this.validateSeller(sellerId);
    try {
      return this.productsRepository.find({
        where: { seller: { id: sellerId } },
        relations: ['category'],
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch seller products');
    }
  }

  async createProduct(sellerId: string, createProductDto: CreateProductDto) {
    const seller = await this.validateSeller(sellerId);
    
    try {
      // Check if SKU is unique
      const existingProduct = await this.productsRepository.findOne({
        where: { sku: createProductDto.sku }
      });

      if (existingProduct) {
        throw new BadRequestException(`Product with SKU ${createProductDto.sku} already exists`);
      }

      const product = this.productsRepository.create({
        ...createProductDto,
        seller,
        sellerId: seller.id
      });

      return await this.productsRepository.save(product);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Failed to create product');
    }
  }

  async updateProduct(sellerId: string, productId: string, updateProductDto: UpdateProductDto) {
    await this.validateSeller(sellerId);
    
    try {
      const product = await this.productsRepository.findOne({
        where: { id: productId, seller: { id: sellerId } }
      });

      if (!product) {
        throw new NotFoundException('Product not found or you do not have permission to update it');
      }

      // Check SKU uniqueness if it's being updated
      if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
        const existingProduct = await this.productsRepository.findOne({
          where: { sku: updateProductDto.sku }
        });
        if (existingProduct) {
          throw new BadRequestException(`Product with SKU ${updateProductDto.sku} already exists`);
        }
      }

      Object.assign(product, updateProductDto);
      return await this.productsRepository.save(product);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new BadRequestException('Failed to update product');
    }
  }

  async deleteProduct(sellerId: string, productId: string) {
    await this.validateSeller(sellerId);
    
    try {
      const product = await this.productsRepository.findOne({
        where: { id: productId, seller: { id: sellerId } },
        relations: ['orderItems']
      });

      if (!product) {
        throw new NotFoundException('Product not found or you do not have permission to delete it');
      }

      // Check if product has any orders
      if (product.orderItems?.length > 0) {
        throw new BadRequestException('Cannot delete product with existing orders');
      }

      await this.productsRepository.remove(product);
      return { message: 'Product deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new BadRequestException('Failed to delete product');
    }
  }

  async getSellerOrders(sellerId: string) {
    await this.validateSeller(sellerId);
    
    try {
      return this.ordersRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.items', 'items')
        .leftJoinAndSelect('items.product', 'product')
        .where('product.sellerId = :sellerId', { sellerId })
        .orderBy('order.createdAt', 'DESC')
        .getMany();
    } catch (error) {
      throw new BadRequestException('Failed to fetch seller orders');
    }
  }

  async getSellerProfile(sellerId: string) {
    const seller = await this.validateSeller(sellerId);
    const { password, ...profile } = seller;
    return profile;
  }

  async updateProfile(sellerId: string, updateProfileDto: UpdateSellerProfileDto) {
    const seller = await this.validateSeller(sellerId);
    
    try {
      // If email is being updated, check for uniqueness
      if (updateProfileDto.email && updateProfileDto.email !== seller.email) {
        const existingUser = await this.usersRepository.findOne({
          where: { email: updateProfileDto.email }
        });
        if (existingUser) {
          throw new BadRequestException('Email already exists');
        }
      }

      Object.assign(seller, updateProfileDto);
      const updatedSeller = await this.usersRepository.save(seller);
      const { password, ...result } = updatedSeller;
      return result;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Failed to update profile');
    }
  }

  private async validateSeller(sellerId: string): Promise<User> {
    try {
      const seller = await this.usersRepository.findOne({
        where: { id: sellerId }
      });

      if (!seller) {
        throw new NotFoundException('Seller not found');
      }

      if (seller.role !== UserRole.SELLER && seller.role !== UserRole.ADMIN) {
        throw new UnauthorizedException('Access denied. Seller privileges required.');
      }

      return seller;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) throw error;
      throw new BadRequestException('Failed to validate seller');
    }
  }
} 