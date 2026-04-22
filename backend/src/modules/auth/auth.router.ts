import { createModuleRouter } from '../../utils/routeBuilder';
import {
  AuthenticatedUserSchema,
  LoginRequestSchema,
  LoginResponseSchema,
} from './auth.schema';
import { authController } from './auth.controller';
import { CreateUserRequestSchema } from '../users/user.schema';

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
    security: [],
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

define(
  {
    method: 'put',
    path: '/Register',
    tags: ['Auth'],
    schema: CreateUserRequestSchema,
    responses: {
      201: {
        description: 'Register successful',
        content: {
          'application/json': { schema: LoginResponseSchema },
        },
      },
    },
  },
  authController.register,
);

define(
  {
    method: 'get',
    path: '/getAuthUser',
    tags: ['Auth'],
    responses: {
      200: {
        description: 'Get authenticated user successful',
        content: {
          'application/json': { schema: AuthenticatedUserSchema },
        },
      },
      401: {
        description: 'Authentication failed',
      },
    },
  },
  authController.getAuthenticatedUser,
);
