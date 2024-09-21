import { NextFunction } from 'express';

export function logger3(req: Request, res: Response, next: NextFunction) {
  console.log(`3rd Request...`);
  next();
}
