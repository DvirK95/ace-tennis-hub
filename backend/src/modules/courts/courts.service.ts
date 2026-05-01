import { PrismaPg } from '@prisma/adapter-pg';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import type { CourtSchema } from './courts.schema';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });
type Court = z.infer<typeof CourtSchema>;

export class CourtService {
  async getAllCourts(): Promise<Court[]> {
    const courts = await prisma.court.findMany();
    return courts.map((court) => ({
      ...court,
      createdAt: court.createdAt.toISOString(),
    })) as unknown as Court[];
  }
}

export const courtService = new CourtService();
