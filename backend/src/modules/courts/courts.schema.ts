import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const CourtSchema = z
  .object({
    id: z.uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    name: z.string().openapi({ example: 'Court 1' }),
    location: z
      .string()
      .nullable()
      .openapi({ example: 'מרכז הטניס הבונים, ירושלים' }),
    surface: z
      .enum(['TENNIS_HARD', 'PADEL', 'PICKELBALL'])
      .openapi({ example: 'TENNIS_HARD' }),
    isActive: z.boolean().openapi({ example: true }),
    createdAt: z.iso
      .datetime()
      .openapi({ example: '2026-03-28T12:00:00.000Z' }),
  })
  .openapi('Court');
