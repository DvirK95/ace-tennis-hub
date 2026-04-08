import { z } from 'zod';
import { createModuleRouter } from '../../utils/routeBuilder';
import { LoginRequestSchema, LoginResponseSchema } from './auth.schema';
import { authController } from './auth.controller';

export const authPath = '/auth';
const { router, define } = createModuleRouter(authPath);
export const authRouter = router;

define(
  {
    method: 'post',
    path: '/login',
    tags: ['Auth'],
    summary: 'Sign in with email and password',
    schema: LoginRequestSchema,
    responses: {
      200: {
        description: 'JWT and user profile',
        content: {
          'application/json': { schema: LoginResponseSchema },
        },
      },
      401: {
        description: 'Invalid credentials',
        content: {
          'application/json': {
            schema: z.object({ error: z.string() }),
          },
        },
      },
    },
  },
  authController.login,
);
