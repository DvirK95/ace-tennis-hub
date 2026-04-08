import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';
import { UserSchema } from '../users/user.schema';
import { z } from 'zod';

type User = z.infer<typeof UserSchema>;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return secret;
}

export class AuthService {
  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; user: User } | null> {
    const userRecord = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!userRecord) {
      return null;
    }

    const ok = await bcrypt.compare(password, userRecord.password);
    if (!ok) {
      return null;
    }

    const user: User = {
      id: userRecord.id,
      fullName: userRecord.fullName,
      email: userRecord.email,
      phone: userRecord.phone ?? undefined,
      role: userRecord.role as User['role'],
      makeupCredits: userRecord.makeupCredits,
      createdAt: userRecord.createdAt.toISOString(),
    };

    const signOptions: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as SignOptions['expiresIn'],
    };
    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      getJwtSecret(),
      signOptions,
    );

    return { token, user };
  }
}

export const authService = new AuthService();
