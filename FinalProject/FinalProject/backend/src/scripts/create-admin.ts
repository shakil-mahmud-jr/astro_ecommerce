import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';
import { UserRole } from '../users/user.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const authService = app.get(AuthService);

  try {
    const adminUser = await authService.signUp({
      email: 'akib@gmail.com',
      password: '123456',
      firstName: 'Akib',
      lastName: 'Admin',
      role: UserRole.ADMIN,
    });

    console.log('Admin user created successfully:', adminUser);
  } catch (error) {
    console.error('Failed to create admin user:', error.message);
  } finally {
    await app.close();
  }
}

bootstrap(); 