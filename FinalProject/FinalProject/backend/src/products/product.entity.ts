import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../categories/category.entity';
import { OrderItem } from '../orders/order-item.entity';
import { User } from '../users/user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  sku: string;

  @Column('int')
  stock: number;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => Category, category => category.products, { eager: true })
  category: Category;

  @ManyToOne(() => User, user => user.products)
  seller: User;

  @Column({ type: 'uuid', nullable: true })
  sellerId: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  brand: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  weight: number;

  @Column({ nullable: true })
  dimensions: string;

  @Column({ nullable: true })
  metaTitle: string;

  @Column({ nullable: true })
  metaDescription: string;

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 