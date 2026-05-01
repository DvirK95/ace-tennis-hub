import { Router } from 'express';
import { userRouter, userPath } from './users/user.router';
import { authPath, authRouter } from './auth/auth.router';
import { rolesPath, rolesRouter } from './roles/roles.router';
import { courtsPath, courtsRouter } from './courts/courts.router';

export const apiRouter = Router();

apiRouter.use(userPath, userRouter);
apiRouter.use(authPath, authRouter);
apiRouter.use(rolesPath, rolesRouter);
apiRouter.use(courtsPath, courtsRouter);
