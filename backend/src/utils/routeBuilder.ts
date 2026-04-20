import { Router, RequestHandler } from 'express';
import { registry } from '../config/swagger';
import { validate } from '../middleware/validate';
import { z } from 'zod';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';

type RouteConfigWithSchema = RouteConfig & { schema?: z.ZodObject<any> };

const registeredRefs = new Set<string>();

function getOpenApiRef(schema: any): string | undefined {
  const meta = schema?._def?.openapi;
  return meta?._internal?.refId ?? meta?.ref;
}

function walkAndRegister(schema: unknown, seen = new WeakSet<object>()): void {
  if (!schema || typeof schema !== 'object') return;
  if (seen.has(schema as object)) return;
  seen.add(schema as object);

  const def = (schema as any)._def;
  if (!def) return;

  const ref = getOpenApiRef(schema);
  if (ref && !registeredRefs.has(ref)) {
    registeredRefs.add(ref);
    try {
      registry.register(ref, schema as z.ZodTypeAny);
    } catch {
      // already registered elsewhere - safe to ignore
    }
  }

  const shape =
    typeof def.shape === 'function' ? def.shape() : def.shape;
  if (shape && typeof shape === 'object') {
    for (const key of Object.keys(shape)) walkAndRegister(shape[key], seen);
  }
  if (def.innerType) walkAndRegister(def.innerType, seen);
  if (def.type) walkAndRegister(def.type, seen);
  if (def.element) walkAndRegister(def.element, seen);
  if (def.valueType) walkAndRegister(def.valueType, seen);
  if (def.keyType) walkAndRegister(def.keyType, seen);
  if (def.left) walkAndRegister(def.left, seen);
  if (def.right) walkAndRegister(def.right, seen);
  if (Array.isArray(def.options)) {
    def.options.forEach((o: unknown) => walkAndRegister(o, seen));
  }
  if (Array.isArray(def.items)) {
    def.items.forEach((o: unknown) => walkAndRegister(o, seen));
  }
}

function autoRegisterRouteSchemas(config: RouteConfigWithSchema) {
  if (config.schema) walkAndRegister(config.schema);

  for (const response of Object.values(config.responses ?? {})) {
    const content = (response as any)?.content;
    if (!content) continue;
    for (const mediaType of Object.values(content)) {
      const schema = (mediaType as any)?.schema;
      if (schema) walkAndRegister(schema);
    }
  }
}

export function createModuleRouter(basePath: string) {
  const router = Router();

  return {
    router,
    define: (config: RouteConfigWithSchema, handler: RequestHandler) => {
      autoRegisterRouteSchemas(config);

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
