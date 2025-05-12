import express from 'express';
import {
  getNetWorth,
  getNetWorthByCurrency,
  getRecordStats,
} from 'src/controllers/statistics-controller';
import validate from 'src/middlewares/validators';
import { getRecordStatsSchema } from 'src/schemas/statisticsSchemas';

const statisticsRouter = express.Router();

statisticsRouter.get('/netWorth', getNetWorth);
statisticsRouter.get('/netWorthByCurrency', getNetWorthByCurrency);
statisticsRouter.get(
  '/recordStats',
  validate(getRecordStatsSchema),
  getRecordStats
);

export default statisticsRouter;
