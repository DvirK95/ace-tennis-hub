import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { UserSchema } from '../users/user.schema';

extendZodWithOpenApi(z);

export const LoginRequestSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

export const LoginResponseSchema = z
  .object({
    token: z.string(),
    user: UserSchema,
  })
  .openapi('LoginResponse');
