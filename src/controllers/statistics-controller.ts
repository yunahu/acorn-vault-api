import { Request, Response } from 'express';
import { calculateNetWorth } from 'src/services/statistics';

export const getNetWorth = async (req: Request, res: Response) => {
  const netWorth = await calculateNetWorth(req.user.uid);
  if (netWorth === undefined) {
    res.sendStatus(500);
    return;
  } else res.json(netWorth);
};
