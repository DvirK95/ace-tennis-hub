import { Router } from 'express';
import { userRouter, userPath } from './users/user.router';
import { authPath, authRouter } from './auth/auth.router';

export const apiRouter = Router();

apiRouter.use(userPath, userRouter);
apiRouter.use(authPath, authRouter);
