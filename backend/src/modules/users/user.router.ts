import { z } from 'zod';
import { createModuleRouter } from '../../utils/routeBuilder';
import { UserSchema, CreateUserRequestSchema } from './user.schema';
import { userController } from './user.controller';

export const userPath = '/users';
const { router, define } = createModuleRouter(userPath);
export const userRouter = router;

// ==========================================
// GET /api/users - Get all users
// ==========================================
define(
  {
    method: 'get',
    path: '/GetAllUsers',
    tags: ['Users'],
    summary: 'Get all users',
    responses: {
      200: {
        description: 'List of users',
        content: { 'application/json': { schema: z.array(UserSchema) } },
      },
    },
  },
  userController.getAllUsers,
);

// ==========================================
// POST /api/users - Create a new user
// ==========================================
define(
  {
    method: 'post',
    path: '/CreateUser',
    tags: ['Users'],
    summary: 'Create user',
    schema: CreateUserRequestSchema,
    responses: {
      201: {
        description: 'Created',
        content: { 'application/json': { schema: UserSchema } },
      },
    },
  },
  userController.createUser,
);
