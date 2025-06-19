import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Order } from '../orders/order.entity';
import { Product } from '../products/product.entity';

export enum UserRole {
  ADMIN = 'admin',
  SELLER = 'seller',
  USER = 'user'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole;

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @OneToMany(() => Product, product => product.seller)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Add seller-specific fields
  @Column({ nullable: true })
  storeName: string;

  @Column({ nullable: true })
  storeDescription: string;

  @Column({ default: false })
  isVerified: boolean;

  // Virtual property to maintain compatibility with existing code
  get isSeller(): boolean {
    return this.role === UserRole.SELLER;
  }

  get isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }
} 