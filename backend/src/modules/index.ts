import { Router } from 'express';
import { userRouter, userPath } from './users/user.router';

export const apiRouter = Router();

apiRouter.use(userPath, userRouter);
