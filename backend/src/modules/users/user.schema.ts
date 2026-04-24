import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const UserSchema = z
  .object({
    id: z.uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    fullName: z
      .string()
      .min(2, 'שם מלא חייב להכיל לפחות 2 תווים')
      .openapi({ example: 'דביר ק.' }),
    email: z.email(),
    phone: z.string().openapi({ example: '050-1234567' }),
    role: z.enum(['ADMIN', 'COACH', 'TRAINEE']).openapi({ example: 'TRAINEE' }),
    makeupCredits: z.number().int().min(0).default(0).openapi({ example: 2 }),
    createdAt: z.iso
      .datetime()
      .openapi({ example: '2026-03-28T12:00:00.000Z' }),
    password: z.string().min(8).openapi({ example: 'aA123456' }).nullable(),
    birthDate: z.date(),
    gender: z.enum(['MALE', 'FEMALE']).openapi({}),
    address: z.string().nullable(),
    membershipStartDate: z.date().nullable(),
    membershipEndDate: z.date().nullable(),
  })
  .openapi('User');

export const CreateUserBodySchema = UserSchema.omit({
  id: true,
  createdAt: true,
  makeupCredits: true,
}).openapi('CreateUserRequest');

export const CreateUserRequestSchema = z.object({
  body: CreateUserBodySchema,
});
