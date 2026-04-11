import { z } from 'zod';
import { createModuleRouter } from '../../utils/routeBuilder';
import { LoginRequestSchema, LoginResponseSchema } from './auth.schema';
import { authController } from './auth.controller';

export const authPath = '/auth';
const { router, define } = createModuleRouter(authPath);
export const authRouter = router;

// ==========================================
// POST /api/auth/login - Login a user
// ==========================================

define(
  {
    method: 'post',
    path: '/Login',
    tags: ['Auth'],
    schema: LoginRequestSchema,
    responses: {
      200: {
        description: 'Login successful',
        content: {
          'application/json': { schema: LoginResponseSchema },
        },
      },
      401: {
        description: 'Authentication failed',
      },
    },
  },
  authController.login,
);
