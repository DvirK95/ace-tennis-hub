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
    email: z.string().email().openapi({ example: 'user@example.com' }),
    phone: z.string().optional().openapi({ example: '050-1234567' }),
    role: z.enum(['ADMIN', 'COACH', 'TRAINEE']).openapi({ example: 'TRAINEE' }),
    makeupCredits: z.number().int().min(0).default(0).openapi({ example: 2 }),
    createdAt: z.iso
      .datetime()
      .openapi({ example: '2026-03-28T12:00:00.000Z' }),
  })
  .openapi('User');

export const CreateUserRequestSchema = z.object({
  body: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    phone: z.string().optional(),
    role: z.enum(['ADMIN', 'COACH', 'TRAINEE']).default('TRAINEE'),
    makeupCredits: z.number().int().min(0).optional(),
  }),
});
