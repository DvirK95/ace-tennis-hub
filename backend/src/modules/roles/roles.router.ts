import { z } from 'zod';
import { createModuleRouter } from '../../utils/routeBuilder';

export const rolesPath = '/roles';
const { router, define } = createModuleRouter(rolesPath);
export const rolesRouter = router;

define(
  {
    method: 'get',
    path: '/GetAllRoles',
    tags: ['Users'],
    summary: 'Get all roles',
    responses: {
      200: {
        description: 'List of roles',
        content: { 'application/json': { schema: z.object() } },
      },
    },
  },
  () => {},
);
