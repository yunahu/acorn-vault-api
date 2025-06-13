import { Request, Response } from 'express';
import { GetRecordStatsRequest } from 'src/schemas/statistics-schemas';
import * as statisticsService from 'src/services/statistics-service';

export const getAccountStats = async (req: Request, res: Response) => {
  const accountStats = await statisticsService.getAccountStats(req.user.uid);
  accountStats ? res.json(accountStats) : res.sendStatus(500);
};

export const getRecordStats = async (
  req: GetRecordStatsRequest,
  res: Response
) => {
  const { from, to } = req.query;

  const recordStats = await statisticsService.getRecordStats(
    req.user.uid,
    from,
    to
  );

  recordStats ? res.json(recordStats) : res.sendStatus(500);
};
