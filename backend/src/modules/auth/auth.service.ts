import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
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
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const isPasswordMatch = await bcrypt.compare(data.password, user.password);
    if (!isPasswordMatch) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET ?? 'development-jwt-secret',
      { expiresIn: '24h' },
    );

    return { ...user, token } as unknown as LoginResponse;
  }
}

export const authService = new AuthService();
