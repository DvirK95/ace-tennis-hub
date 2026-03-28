import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodObject } from 'zod';

export const validate =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.issues });
      }
      next(error);
    }
  };
