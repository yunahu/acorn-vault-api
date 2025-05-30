import express from 'express';
import {
  getNetWorth,
  getNetWorthByCurrency,
  getRecordStats,
} from 'src/controllers/statistics-controller';
import validate from 'src/middlewares/validators';
import { getRecordStatsSchema } from 'src/schemas/statisticsSchemas';

const statisticsRouter = express.Router();

statisticsRouter.get('/net_worth', getNetWorth);
statisticsRouter.get('/net_worth_by_currency', getNetWorthByCurrency);
statisticsRouter.get(
  '/record_stats',
  validate(getRecordStatsSchema),
  getRecordStats
);

export default statisticsRouter;
