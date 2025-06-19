import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/user.entity';
import { SignUpDto, SignInDto, AuthResponse } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
    const { email, password, firstName, lastName, role, storeName, storeDescription } = signUpDto;
    console.log('Attempting to sign up user:', { email, firstName, lastName, role });

    // Check if user exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      console.log('User already exists:', email);
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || UserRole.USER,
      // If registering as a seller, set these fields
      ...(role === UserRole.SELLER && {
        storeName,
        storeDescription,
        isVerified: false, // New sellers start as unverified
      }),
    });

    await this.userRepository.save(user);
    console.log('User created successfully:', { id: user.id, email: user.email, role: user.role });

    // Generate JWT token
    const token = this.jwtService.sign({ id: user.id, role: user.role });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
        storeName: user.storeName,
        storeDescription: user.storeDescription,
      },
    };
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    console.log('Attempting to sign in user:', { email: signInDto.email });
    const { email, password } = signInDto;
    
    const user = await this.userRepository.findOne({ where: { email } });
    console.log('Found user:', user ? { id: user.id, email: user.email, role: user.role } : 'null');

    if (!user) {
      console.log('User not found:', email);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password validation:', { isValid: isPasswordValid });
    
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      throw new UnauthorizedException('Invalid credentials');
    }

    // For seller accounts, check verification status
    if (user.role === UserRole.SELLER && !user.isVerified) {
      throw new UnauthorizedException('Your seller account is pending approval');
    }

    const token = this.jwtService.sign({ id: user.id, role: user.role });
    console.log('Login successful, generating token for user:', { id: user.id, email: user.email });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
        storeName: user.storeName,
        storeDescription: user.storeDescription,
      },
    };
  }
} 