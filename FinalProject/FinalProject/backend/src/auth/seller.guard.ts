import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../users/user.entity';

@Injectable()
export class SellerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Access denied. Seller role required.');
    }

    return true;
  }
} 