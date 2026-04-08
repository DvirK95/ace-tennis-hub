import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { UserSchema, CreateUserRequestSchema } from './user.schema';
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
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email.toLowerCase().trim(),
        password: passwordHash,
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
