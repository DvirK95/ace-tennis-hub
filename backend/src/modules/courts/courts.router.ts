import z from 'zod';
import { createModuleRouter } from '../../utils/routeBuilder';
import { courtController } from './courts.controller';
import { CourtSchema } from './courts.schema';

export const courtsPath = '/courts';
const { router, define } = createModuleRouter(courtsPath);
export const courtsRouter = router;

define(
  {
    method: 'get',
    path: '/GetAllCourts',
    tags: ['Courts'],
    summary: 'Get all courts',
    responses: {
      200: {
        description: 'Get all courts successful',
        content: { 'application/json': { schema: z.array(CourtSchema) } },
      },
    },
  },
  courtController.getAllCourts,
);

define(
  {
    method: 'post',
    path: '/CreateCourt',
    tags: ['Courts'],
    summary: 'Create a court',
    schema: CourtSchema,
    responses: {
      201: {
        description: 'Create a court successful',
        content: { 'application/json': { schema: CourtSchema } },
      },
    },
  },
  courtController.createCourt,
);
