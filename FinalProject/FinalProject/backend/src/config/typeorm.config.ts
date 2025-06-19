import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'bazar_db',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true, // Don't use this in production
}; 