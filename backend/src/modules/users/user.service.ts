import { PrismaPg } from '@prisma/adapter-pg';
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
    return users.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
    })) as User[];
  }

  async createUser(data: CreateUserInput): Promise<User> {
    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        role: data.role,
        makeupCredits: data.makeupCredits || 0,
      },
    });

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
    } as User;
  }
}

export const userService = new UserService();
