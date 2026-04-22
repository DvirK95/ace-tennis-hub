import { Request, Response } from 'express';
import { authService } from './auth.service';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const token = await authService.login(req.body);
      res.status(200).json(token);
    } catch (error) {
      if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  async getAuthenticatedUser(req: Request, res: Response) {
    try {
      const user = await authService.getAuthenticatedUser(
        req.headers.authorization ?? '',
      );
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error && error.message === 'INVALID_TOKEN') {
        res.status(401).json({ error: 'Authentication failed' });
        return;
      }
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export const authController = new AuthController();
