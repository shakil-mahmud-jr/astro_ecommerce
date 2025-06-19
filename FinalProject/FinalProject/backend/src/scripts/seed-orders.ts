import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { OrdersService } from '../orders/orders.service';
import { CategoriesService } from '../categories/categories.service';
import { UserRole } from '../users/user.entity';
import { OrderStatus, PaymentStatus } from '../orders/order.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const productsService = app.get(ProductsService);
  const ordersService = app.get(OrdersService);
  const categoriesService = app.get(CategoriesService);

  try {
    // Create test users
    const testUsers = await Promise.all([
      usersService.create({
        email: 'customer1@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.USER,
      }),
      usersService.create({
        email: 'customer2@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
        role: UserRole.USER,
      }),
    ]);

    // Create categories
    const categories = await Promise.all([
      categoriesService.create({ name: 'Electronics', description: 'Electronic devices and accessories' }),
      categoriesService.create({ name: 'Books', description: 'Books and e-books' }),
      categoriesService.create({ name: 'Clothing', description: 'Apparel and accessories' }),
    ]);

    // Create products
    const products = await Promise.all([
      productsService.create({
        name: 'Smartphone X',
        description: 'Latest smartphone with amazing features',
        price: 999.99,
        stock: 50,
        categoryId: categories[0].id,
        sku: 'PHONE-001',
        brand: 'TechBrand',
        weight: 0.2,
        dimensions: '15x7x0.8',
      }),
      productsService.create({
        name: 'Laptop Pro',
        description: 'Professional laptop for developers',
        price: 1499.99,
        stock: 30,
        categoryId: categories[0].id,
        sku: 'LAPTOP-001',
        brand: 'TechBrand',
        weight: 2.1,
        dimensions: '35x24x2',
      }),
      productsService.create({
        name: 'Programming Guide',
        description: 'Complete guide to modern programming',
        price: 49.99,
        stock: 100,
        categoryId: categories[1].id,
        sku: 'BOOK-001',
        brand: 'TechBooks',
        weight: 0.8,
        dimensions: '24x17x3',
      }),
      productsService.create({
        name: 'Developer T-Shirt',
        description: 'Comfortable t-shirt for developers',
        price: 24.99,
        stock: 200,
        categoryId: categories[2].id,
        sku: 'SHIRT-001',
        brand: 'DevWear',
        weight: 0.2,
        dimensions: '30x20x2',
      }),
    ]);

    // Create orders
    const orders = await Promise.all([
      // Order 1: Completed order with multiple items
      ordersService.create({
        userId: testUsers[0].id,
        items: [
          { productId: products[0].id, quantity: 1 },
          { productId: products[2].id, quantity: 2 },
        ],
        shippingAddress: '123 Main St, City, Country',
        billingAddress: '123 Main St, City, Country',
        notes: 'Please handle with care',
      }),
      // Order 2: Processing order
      ordersService.create({
        userId: testUsers[1].id,
        items: [
          { productId: products[1].id, quantity: 1 },
          { productId: products[3].id, quantity: 3 },
        ],
        shippingAddress: '456 Oak St, City, Country',
        billingAddress: '456 Oak St, City, Country',
      }),
      // Order 3: Pending order
      ordersService.create({
        userId: testUsers[0].id,
        items: [
          { productId: products[2].id, quantity: 1 },
          { productId: products[3].id, quantity: 2 },
        ],
        shippingAddress: '789 Pine St, City, Country',
        billingAddress: '789 Pine St, City, Country',
      }),
    ]);

    // Update order statuses
    await ordersService.updateStatus(orders[0].id, OrderStatus.DELIVERED);
    await ordersService.updatePaymentStatus(orders[0].id, PaymentStatus.PAID);

    await ordersService.updateStatus(orders[1].id, OrderStatus.PROCESSING);
    await ordersService.updatePaymentStatus(orders[1].id, PaymentStatus.PAID);

    console.log('Seed data created successfully!');
    console.log(`Created ${testUsers.length} users`);
    console.log(`Created ${categories.length} categories`);
    console.log(`Created ${products.length} products`);
    console.log(`Created ${orders.length} orders`);

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await app.close();
  }
}

seed(); 