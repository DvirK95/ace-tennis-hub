import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { UserSchema } from '../users/user.schema';

extendZodWithOpenApi(z);

export const LoginRequestSchema = z.object({
  body: z
    .object({
      email: z.email(),
      password: z.string().min(6).openapi({ example: 'password' }),
    })
    .openapi('LoginRequest'),
});

export const LoginResponseSchema = z
  .object({
    user: UserSchema,
    token: z.string(),
  })
  .openapi('LoginResponse');

export const AuthenticatedUserSchema = z
  .object({
    user: UserSchema,
    sub: z.string(),
    permissions: z.array(z.string()),
  })
  .openapi('AuthenticatedUser');
