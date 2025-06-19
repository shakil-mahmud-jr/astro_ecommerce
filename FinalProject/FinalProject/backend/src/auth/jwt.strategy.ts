import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
    console.log('JWT Strategy initialized');
  }

  async validate(payload: { id: string, role: UserRole }) {
    console.log('Validating JWT payload:', { id: payload.id, role: payload.role });
    const { id, role } = payload;
    
    const user = await this.userRepository.findOne({ where: { id } });
    console.log('Found user:', user ? { id: user.id, email: user.email, role: user.role } : 'null');

    if (!user || user.role !== role) {
      console.log('JWT validation failed:', { 
        userExists: !!user, 
        expectedRole: role, 
        actualRole: user?.role 
      });
      throw new UnauthorizedException();
    }

    // For admin routes, check if user has admin role
    if (role === UserRole.ADMIN && user.role !== UserRole.ADMIN) {
      console.log('Admin privileges check failed:', { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      });
      throw new UnauthorizedException('Admin privileges required');
    }

    console.log('JWT validation successful:', { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    });
    return user;
  }
} 