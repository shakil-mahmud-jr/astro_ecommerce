import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Tree, TreeChildren, TreeParent } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity()
@Tree("materialized-path")
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  metaTitle: string;

  @Column({ nullable: true, length: 160 })
  metaDescription: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  displayOrder: number;

  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent: Category;

  @OneToMany(() => Product, product => product.category)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: 0 })
  productCount: number;
} 