import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order, OrderStatus } from '../orders/order.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { UserRole } from '../users/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { format } from 'date-fns';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getDashboardStats() {
    const [
      ordersCount,
      productsCount,
      customersCount,
      totalRevenue,
      recentOrders,
      ordersByStatus,
      revenueByDay
    ] = await Promise.all([
      this.calculateOrdersCount(),
      this.calculateProductsCount(),
      this.calculateCustomersCount(),
      this.calculateTotalRevenue(),
      this.getRecentOrders(),
      this.getOrdersByStatus(),
      this.getRevenueByDay()
    ]);

    return {
      ordersCount,
      productsCount,
      customersCount,
      totalRevenue,
      recentOrders,
      ordersByStatus,
      revenueByDay
    };
  }

  private async getRecentOrders(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
      take: 10
    });
  }

  private async getOrdersByStatus(): Promise<Record<OrderStatus, number>> {
    try {
      const result = await this.ordersRepository
        .createQueryBuilder('order')
        .select('order.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .groupBy('order.status')
        .getRawMany();

      const statusCounts: Record<OrderStatus, number> = {
        [OrderStatus.PENDING]: 0,
        [OrderStatus.PROCESSING]: 0,
        [OrderStatus.SHIPPED]: 0,
        [OrderStatus.DELIVERED]: 0,
        [OrderStatus.CANCELLED]: 0
      };

      result.forEach(({ status, count }) => {
        statusCounts[status] = Number(count || 0);
      });

      return statusCounts;
    } catch (error) {
      console.error('Error calculating orders by status:', error);
      return {
        [OrderStatus.PENDING]: 0,
        [OrderStatus.PROCESSING]: 0,
        [OrderStatus.SHIPPED]: 0,
        [OrderStatus.DELIVERED]: 0,
        [OrderStatus.CANCELLED]: 0
      };
    }
  }

  private async getRevenueByDay(): Promise<{ date: string; revenue: number }[]> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await this.ordersRepository
        .createQueryBuilder('order')
        .select("DATE_TRUNC('day', order.createdAt)", 'date')
        .addSelect('COALESCE(SUM(order.total), 0)', 'revenue')
        .where('order.createdAt >= :startDate', { startDate: thirtyDaysAgo })
        .groupBy('date')
        .orderBy('date', 'ASC')
        .getRawMany();

      return result.map(({ date, revenue }) => ({
        date: date.toISOString().split('T')[0],
        revenue: Number(revenue || 0)
      }));
    } catch (error) {
      console.error('Error calculating revenue by day:', error);
      return [];
    }
  }

  async getCustomersWithStats() {
    // Get all customers (users with role USER)
    const customers = await this.usersRepository.find({
      where: { role: UserRole.USER },
      relations: ['orders'],
      order: { createdAt: 'DESC' },
    });

    // Calculate stats for each customer
    return customers.map(customer => {
      const orders = customer.orders || [];
      const totalOrders = orders.length;
      // Ensure we're working with numbers and format to 2 decimal places
      const totalSpent = Number(orders.reduce((sum, order) => sum + Number(order.total || 0), 0).toFixed(2));
      const averageOrderValue = totalOrders > 0 ? Number((totalSpent / totalOrders).toFixed(2)) : 0;
      const lastOrderDate = orders.length > 0 
        ? Math.max(...orders.map(order => new Date(order.createdAt).getTime()))
        : null;

      // Remove sensitive information and add stats
      const { password, role, updatedAt, ...customerData } = customer;
      return {
        ...customerData,
        stats: {
          totalOrders,
          totalSpent,
          averageOrderValue,
          lastOrderDate: lastOrderDate ? new Date(lastOrderDate).toISOString() : null,
        },
      };
    });
  }

  async createCustomer(createUserDto: CreateUserDto) {
    // Check if email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email }
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Create the new user with role USER
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: UserRole.USER,
    });

    // Save the user
    const savedUser = await this.usersRepository.save(newUser);

    // Remove sensitive information before returning
    const { password, ...result } = savedUser;
    return {
      ...result,
      stats: {
        totalOrders: 0,
        totalSpent: 0,
        averageOrderValue: 0,
        lastOrderDate: null,
      },
    };
  }

  async deleteCustomer(id: string) {
    try {
      // Find the customer with their orders
      const customer = await this.usersRepository.findOne({
        where: { id },
        relations: ['orders']
      });

      if (!customer) {
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }

      // Check if the user is actually a customer (not an admin or seller)
      if (customer.role !== UserRole.USER) {
        throw new BadRequestException('Can only delete customers');
      }

      // Check if customer has any orders
      if (customer.orders && customer.orders.length > 0) {
        throw new BadRequestException('Cannot delete customer with existing orders');
      }

      // Delete the customer
      await this.usersRepository.remove(customer);

      return {
        message: 'Customer deleted successfully',
        id: id
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting customer');
    }
  }

  async updateCustomer(id: string, updateUserDto: any) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['orders'],
    });

    if (!user) {
      throw new NotFoundException('Customer not found');
    }

    if (user.role !== UserRole.USER) {
      throw new BadRequestException('Cannot update non-customer users');
    }

    // If email is being updated, check for duplicates
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email }
      });

      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
    }

    // Update the user
    Object.assign(user, updateUserDto);
    
    // Save the updated user
    const savedUser = await this.usersRepository.save(user);
    
    // Calculate stats
    const orders = savedUser.orders || [];
    const totalOrders = orders.length;
    const totalSpent = Number(orders.reduce((sum, order) => sum + Number(order.total || 0), 0).toFixed(2));
    const averageOrderValue = totalOrders > 0 ? Number((totalSpent / totalOrders).toFixed(2)) : 0;
    const lastOrderDate = orders.length > 0 
      ? Math.max(...orders.map(order => new Date(order.createdAt).getTime()))
      : null;

    // Remove sensitive information and add stats
    const { password, role, updatedAt, ...result } = savedUser;
    return {
      ...result,
      stats: {
        totalOrders,
        totalSpent,
        averageOrderValue,
        lastOrderDate: lastOrderDate ? new Date(lastOrderDate).toISOString() : null,
      },
    };
  }

  private async calculateOrdersCount(): Promise<number> {
    try {
      return await this.ordersRepository.count();
    } catch (error) {
      console.error('Error calculating orders count:', error);
      return 0;
    }
  }

  private async calculateProductsCount(): Promise<number> {
    try {
      return await this.productsRepository.count();
    } catch (error) {
      console.error('Error calculating products count:', error);
      return 0;
    }
  }

  private async calculateCustomersCount(): Promise<number> {
    try {
      return await this.usersRepository.count({
        where: { role: UserRole.USER },
      });
    } catch (error) {
      console.error('Error calculating customers count:', error);
      return 0;
    }
  }

  private async calculateTotalRevenue(): Promise<number> {
    try {
      const result = await this.ordersRepository
        .createQueryBuilder('orders')
        .select('COALESCE(SUM(orders.total), 0)', 'total')
        .getRawOne();

      return Number(result?.total || 0);
    } catch (error) {
      console.error('Error calculating total revenue:', error);
      return 0;
    }
  }

  async generateReport(): Promise<string> {
    try {
      // Fetch all necessary data
      const [
        orders,
        products,
        customers,
        ordersByStatus,
        revenueByDay
      ] = await Promise.all([
        this.ordersRepository.find({
          relations: ['user', 'items', 'items.product'],
          order: { createdAt: 'DESC' }
        }),
        this.productsRepository.find(),
        this.usersRepository.find({ where: { role: UserRole.USER } }),
        this.getOrdersByStatus(),
        this.getRevenueByDay()
      ]);

      // Generate CSV content
      const csvContent: string[] = [];

      // Add report header
      csvContent.push('Dashboard Report - Generated on ' + format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
      csvContent.push('');

      // Add summary section
      csvContent.push('Summary');
      csvContent.push(`Total Orders,${orders.length}`);
      csvContent.push(`Total Revenue,${orders.reduce((sum, order) => sum + Number(order.total || 0), 0).toFixed(2)}`);
      csvContent.push(`Total Customers,${customers.length}`);
      csvContent.push(`Total Products,${products.length}`);
      csvContent.push('');

      // Add orders by status section
      csvContent.push('Orders by Status');
      Object.entries(ordersByStatus).forEach(([status, count]) => {
        csvContent.push(`${status},${count}`);
      });
      csvContent.push('');

      // Add revenue by day section
      csvContent.push('Revenue by Day');
      csvContent.push('Date,Revenue');
      revenueByDay.forEach(({ date, revenue }) => {
        csvContent.push(`${date},${revenue.toFixed(2)}`);
      });
      csvContent.push('');

      // Add recent orders section
      csvContent.push('Recent Orders');
      csvContent.push('Order ID,Customer,Total,Status,Payment Status,Date');
      orders.slice(0, 10).forEach(order => {
        csvContent.push(`${order.id},${order.user.firstName} ${order.user.lastName},${order.total},${order.status},${order.paymentStatus},${format(new Date(order.createdAt), 'yyyy-MM-dd')}`);
      });
      csvContent.push('');

      // Add product inventory section
      csvContent.push('Product Inventory');
      csvContent.push('Product Name,SKU,Price,Stock');
      products.forEach(product => {
        csvContent.push(`${product.name},${product.sku},${product.price},${product.stock}`);
      });

      return csvContent.join('\n');
    } catch (error) {
      console.error('Error generating report:', error);
      throw new BadRequestException('Failed to generate report');
    }
  }

  async getSellers() {
    return this.usersRepository.find({
      where: { role: UserRole.SELLER },
      order: { createdAt: 'DESC' },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'storeName',
        'storeDescription',
        'isVerified',
        'createdAt',
        'updatedAt'
      ]
    });
  }

  async getPendingSellers() {
    return this.usersRepository.find({
      where: { 
        role: UserRole.SELLER,
        isVerified: false
      },
      order: { createdAt: 'DESC' },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'storeName',
        'storeDescription',
        'createdAt'
      ]
    });
  }

  async verifySeller(id: string) {
    const seller = await this.usersRepository.findOne({
      where: { id, role: UserRole.SELLER }
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    seller.isVerified = true;
    await this.usersRepository.save(seller);

    return {
      message: 'Seller verified successfully',
      seller: {
        id: seller.id,
        email: seller.email,
        firstName: seller.firstName,
        lastName: seller.lastName,
        storeName: seller.storeName,
        isVerified: seller.isVerified
      }
    };
  }

  async rejectSeller(id: string) {
    const seller = await this.usersRepository.findOne({
      where: { id, role: UserRole.SELLER }
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    // Instead of deleting, we could also just mark them as rejected
    await this.usersRepository.remove(seller);

    return {
      message: 'Seller rejected and removed successfully'
    };
  }
} 