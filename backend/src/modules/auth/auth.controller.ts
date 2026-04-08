import { Request, Response } from 'express';
import { authService } from './auth.service';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as {
        email: string;
        password: string;
      };

      const result = await authService.login(email, password);
      if (!result) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export const authController = new AuthController();
