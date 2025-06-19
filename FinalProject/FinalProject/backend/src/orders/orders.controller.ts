import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseInterceptors,
  ParseUUIDPipe, 
  HttpStatus, 
  HttpCode, 
  Query,
  UseGuards
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus, PaymentStatus } from './order.entity';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('orders')
@UseInterceptors(TransformInterceptor)
@UseGuards(JwtAuthGuard, AdminGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('status') status?: OrderStatus): Promise<Order[]> {
    if (status) {
      return this.ordersService.findByStatus(status);
    }
    return this.ordersService.findAll();
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async findByUser(@Param('userId', ParseUUIDPipe) userId: string): Promise<Order[]> {
    return this.ordersService.findByUser(userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.ordersService.remove(id);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: OrderStatus,
  ): Promise<Order> {
    return this.ordersService.updateStatus(id, status);
  }

  @Patch(':id/payment')
  @HttpCode(HttpStatus.OK)
  async updatePaymentStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('paymentStatus') paymentStatus: PaymentStatus,
  ): Promise<Order> {
    return this.ordersService.updatePaymentStatus(id, paymentStatus);
  }
} 