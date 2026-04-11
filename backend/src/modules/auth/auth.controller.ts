import { Request, Response } from 'express';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      res.status(200).send('Bearer some-token');
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export const authController = new AuthController();
