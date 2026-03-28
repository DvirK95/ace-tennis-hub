import { Request, Response } from 'express';
import { userService } from './user.service';

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const newUser = await userService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export const userController = new UserController();
