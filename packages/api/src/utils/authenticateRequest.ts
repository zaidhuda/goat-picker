import { NextFunction, Request, Response } from 'express';

export default function authenticateRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const secret = process.env.API_SECRET;
  if (!!secret && req.headers.authorization !== secret) {
    res.status(401).send('Unauthorized');
    return;
  }

  return next();
}
