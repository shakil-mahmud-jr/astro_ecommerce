import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Category } from '../categories/category.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { Order, OrderStatus } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';
import { UserRole } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { getRepositoryToken } from '@nestjs/typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // Get repositories
    const categoryRepository = app.get(getRepositoryToken(Category));
    const productRepository = app.get(getRepositoryToken(Product));
    const userRepository = app.get(getRepositoryToken(User));
    const orderRepository = app.get(getRepositoryToken(Order));
    const orderItemRepository = app.get(getRepositoryToken(OrderItem));

    // Seed Categories
    const categories = [
      { name: 'Electronics', description: 'Electronic devices and accessories', slug: 'electronics' },
      { name: 'Clothing', description: 'Fashion and apparel', slug: 'clothing' },
      { name: 'Books', description: 'Books and literature', slug: 'books' },
      { name: 'Home & Garden', description: 'Home decor and gardening items', slug: 'home-garden' }
    ];

    const savedCategories: Category[] = [];
    for (const category of categories) {
      let savedCategory = await categoryRepository.findOne({ where: { slug: category.slug } });
      if (!savedCategory) {
        savedCategory = await categoryRepository.save(categoryRepository.create(category));
        console.log(`Created category: ${category.name}`);
      } else {
        console.log(`Category ${category.name} already exists`);
      }
      savedCategories.push(savedCategory);
    }
    console.log('Categories seeding completed');

    // Seed Products
    const products = [
      {
        name: 'Smartphone',
        description: 'Latest model smartphone',
        price: 999.99,
        sku: 'PHONE001',
        stock: 50,
        imageUrl: 'https://example.com/smartphone.jpg',
        category: savedCategories[0]
      },
      {
        name: 'Laptop',
        description: 'High-performance laptop',
        price: 1499.99,
        sku: 'LAPTOP001',
        stock: 30,
        imageUrl: 'https://example.com/laptop.jpg',
        category: savedCategories[0]
      },
      {
        name: 'T-Shirt',
        description: 'Cotton t-shirt',
        price: 29.99,
        sku: 'TSHIRT001',
        stock: 100,
        imageUrl: 'https://example.com/tshirt.jpg',
        category: savedCategories[1]
      }
    ];

    const savedProducts: Product[] = [];
    for (const product of products) {
      let savedProduct = await productRepository.findOne({ where: { sku: product.sku } });
      if (!savedProduct) {
        savedProduct = await productRepository.save(productRepository.create(product));
        console.log(`Created product: ${product.name}`);
      } else {
        console.log(`Product ${product.name} already exists`);
      }
      savedProducts.push(savedProduct);
    }
    console.log('Products seeding completed');

    // Seed Test Customer
    const customerEmail = 'customer@example.com';
    let customer = await userRepository.findOne({ where: { email: customerEmail } });
    if (!customer) {
      const hashedPassword = await bcrypt.hash('customer123', 10);
      const customerData = {
        email: customerEmail,
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.USER
      };
      customer = await userRepository.save(userRepository.create(customerData));
      console.log('Test customer created successfully');
    } else {
      console.log('Test customer already exists');
    }

    // Seed Test Order
    const existingOrder = await orderRepository.findOne({
      where: { user: { id: customer.id } },
      relations: ['user']
    });

    if (!existingOrder) {
      const orderData = {
        user: customer,
        subtotal: 2529.97,
        tax: 202.40,
        shipping: 15.00,
        total: 2747.37,
        status: OrderStatus.PENDING,
        shippingAddress: '123 Main St, City, Country',
        billingAddress: '123 Main St, City, Country'
      };
      const order = await orderRepository.save(orderRepository.create(orderData));
      console.log('Test order created successfully');

      // Seed Order Items
      const orderItemsData = [
        {
          order,
          product: savedProducts[0],
          quantity: 1,
          price: savedProducts[0].price,
          subtotal: savedProducts[0].price
        },
        {
          order,
          product: savedProducts[1],
          quantity: 1,
          price: savedProducts[1].price,
          subtotal: savedProducts[1].price
        }
      ];

      for (const item of orderItemsData) {
        await orderItemRepository.save(orderItemRepository.create(item));
      }
      console.log('Order items created successfully');
    } else {
      console.log('Test order already exists');
    }

    console.log('All test data seeding completed');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  } finally {
    await app.close();
  }
}

bootstrap();