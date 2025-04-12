import { NextApiRequest, NextApiResponse } from 'next';

type MiddlewareFn = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: (err?: unknown) => void
) => void;

export default function middleware(middlewareFn: MiddlewareFn) {
  return (req: NextApiRequest, res: NextApiResponse) =>
    new Promise<void>((resolve, reject) => {
      middlewareFn(req, res, (result) => {
        if (result instanceof Error) return reject(result);
        return resolve();
      });
    });
}
