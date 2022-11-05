import { config, Request, Response } from 'firebase-functions/v1';

export default function authentiateRequest(
  next: (req: Request, res: Response) => void
): (req: Request, res: Response) => void {
  return (req: Request, res: Response): void => {
    const secret = config().api?.secret;

    if (!!secret && req.headers.authorization !== secret) {
      res.status(401).send('Unauthorized');
      return;
    }

    return next(req, res);
  };
}
