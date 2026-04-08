import { Router } from 'express';
import { authRouter, authPath } from './auth/auth.router';
import { userRouter, userPath } from './users/user.router';

export const apiRouter = Router();

apiRouter.use(authPath, authRouter);
apiRouter.use(userPath, userRouter);
