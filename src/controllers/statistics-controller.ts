import { Request, Response } from 'express';
import { netWorth } from 'src/services/statistics';

export const getNetWorth = async (req: Request, res: Response) => {
  const response = await netWorth(req.user.uid);
  if (response === undefined) {
    res.sendStatus(500);
    return;
  } else res.json(response);
};
