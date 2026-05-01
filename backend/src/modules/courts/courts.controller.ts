import { Request, Response } from 'express';
import { courtService } from './courts.service';

export class CourtController {
  async getAllCourts(req: Request, res: Response) {
    try {
      const courts = await courtService.getAllCourts();
      res.status(200).json(courts);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
export const courtController = new CourtController();
