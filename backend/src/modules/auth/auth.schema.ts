import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const LoginRequestSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(6).openapi({ example: 'password' }),
  }),
});
