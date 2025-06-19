import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['user', 'items', 'items.product'],
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product']
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const user = await this.usersRepository.findOne({
      where: { id: createOrderDto.userId }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${createOrderDto.userId} not found`);
    }

    // Calculate order totals
    let subtotal = 0;
    const orderItems: OrderItem[] = [];

    // Process each order item
    for (const item of createOrderDto.items) {
      const product = await this.productsRepository.findOne({
        where: { id: item.productId }
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${product.name}`);
      }

      // Create order item
      const orderItem = this.orderItemsRepository.create({
        product,
        quantity: item.quantity,
        price: product.price,
        subtotal: product.price * item.quantity
      });

      subtotal += orderItem.subtotal;
      orderItems.push(orderItem);

      // Update product stock
      product.stock -= item.quantity;
      await this.productsRepository.save(product);
    }

    // Calculate tax and shipping
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;

    // Create order
    const order = this.ordersRepository.create({
      user,
      items: orderItems,
      subtotal,
      tax,
      shipping,
      total,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      shippingAddress: createOrderDto.shippingAddress,
      billingAddress: createOrderDto.billingAddress,
      notes: createOrderDto.notes
    });

    return this.ordersRepository.save(order);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    // Update order fields
    Object.assign(order, updateOrderDto);

    return this.ordersRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);

    // Restore product stock
    for (const item of order.items) {
      const product = item.product;
      product.stock += item.quantity;
      await this.productsRepository.save(product);
    }

    await this.ordersRepository.remove(order);
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { status },
      relations: ['user', 'items', 'items.product'],
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'items', 'items.product'],
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    return this.ordersRepository.save(order);
  }

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.paymentStatus = paymentStatus;
    return this.ordersRepository.save(order);
  }
} 