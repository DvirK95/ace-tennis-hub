import { Router, RequestHandler } from 'express';
import { registry } from '../config/swagger';
import { validate } from '../middleware/validate';
import { z } from 'zod';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';

type RouteConfigWithSchema = RouteConfig & { schema?: z.ZodObject<any> };
export function createModuleRouter(basePath: string) {
  const router = Router();

  return {
    router,
    define: (config: RouteConfigWithSchema, handler: RequestHandler) => {
      const fullSwaggerPath =
        `/api${basePath}${config.path === '/' ? '' : config.path}`.replace(
          /:(\w+)/g,
          '{$1}',
        );

      registry.registerPath({
        method: config.method,
        tags: config.tags,
        summary: config.summary,
        path: fullSwaggerPath,
        request: config.schema?.shape?.body
          ? {
              body: {
                content: {
                  'application/json': { schema: config.schema.shape.body },
                },
              },
            }
          : undefined,
        responses: config.responses,
      });

      if (config.schema) {
        router[config.method](config.path, validate(config.schema), handler);
      } else {
        router[config.method](config.path, handler);
      }
    },
  };
}
