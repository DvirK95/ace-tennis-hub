import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import { z } from 'zod';
import { LoginRequestSchema, LoginResponseSchema } from './auth.schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type LoginInput = z.infer<typeof LoginRequestSchema>['body'];

type LoginResponse = z.infer<typeof LoginResponseSchema>;

export class AuthService {
  async login(data: LoginInput): Promise<LoginResponse> {
    const potentialUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!potentialUser) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const isPasswordMatch = await bcrypt.compare(
      data.password,
      potentialUser.password,
    );
    if (!isPasswordMatch) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const token = jwt.sign(
      {
        sub: potentialUser.id,
        email: potentialUser.email,
        role: potentialUser.role,
      },
      process.env.JWT_SECRET ?? 'development-jwt-secret',
      { expiresIn: '24h' },
    );

    const user = {
      ...potentialUser,
      password: null,
    } as unknown as LoginResponse['user'];

    return { user, token };
  }
  async register(data: User): Promise<User> {
    const { createdAt, updatedAt, ...rest } = data;
    const user = await prisma.user.create({
      data: {
        ...rest,
        password: await bcrypt.hash(data.password, 10),
      },
    });
    return user;
  }
}

export const authService = new AuthService();
