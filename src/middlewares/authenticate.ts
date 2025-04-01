import { NextFunction, Request, Response } from 'express';
import { auth } from 'src/services/firebase';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const idToken = req.headers?.authorization?.slice(7);

  try {
    if (idToken) {
      const decodedToken = await auth.verifyIdToken(idToken);
      const uid = decodedToken.uid;
      req.user = { uid };
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(401);
  }

  next();
};
