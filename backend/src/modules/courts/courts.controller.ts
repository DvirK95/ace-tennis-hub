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
  async createCourt(req: Request, res: Response) {
    try {
      const court = await courtService.createCourt(req.body);
      res.status(201).json(court);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
export const courtController = new CourtController();
