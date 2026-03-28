import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import { UserSchema } from '../modules/users/user.schema';

export const registry = new OpenAPIRegistry();

registry.register('User', UserSchema);

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'AceClub API',
      description: 'The backend API for AceClub Manager',
    },
    servers: [{ url: `http://localhost:${process.env.PORT}` }],
  });
}
