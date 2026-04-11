import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { UserSchema, CreateUserRequestSchema } from './user.schema';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });
type User = z.infer<typeof UserSchema>;
type CreateUserInput = z.infer<typeof CreateUserRequestSchema>['body'];

export class UserService {
  async getAllUsers(): Promise<User[]> {
    const users = await prisma.user.findMany();
    return users.map(({ password: _p, ...user }) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
    })) as User[];
  }

  async createUser(data: CreateUserInput): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        password: passwordHash,
        phone: data.phone,
        role: data.role,
        makeupCredits: data.makeupCredits ?? 0,
      },
    });

    const { password: _p, ...safe } = user;
    return {
      ...safe,
      createdAt: user.createdAt.toISOString(),
    } as User;
  }
}

export const userService = new UserService();
