import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const PermissionSchema = z
  .object({
    name: z.string(),
    description: z.string().nullable(),
  })
  .openapi('Permission');

export const RoleSchema = z
  .object({
    name: z.string(),
    description: z.string().nullable(),
    permissions: z.array(PermissionSchema),
  })
  .openapi('Role');
