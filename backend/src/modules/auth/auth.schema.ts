import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { UserSchema } from '../users/user.schema';

extendZodWithOpenApi(z);

export const LoginRequestSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(6).openapi({ example: 'password' }),
  }),
});

export const LoginResponseSchema = z
  .object({
    ...UserSchema.shape,
    token: z.string(),
  })
  .openapi('LoginResponseSchema');
