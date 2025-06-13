import express from 'express';
import {
  getAccountStats,
  getRecordStats,
} from 'src/controllers/statistics-controller';
import validate from 'src/middlewares/validators';
import { getRecordStatsSchema } from 'src/schemas/statistics-schemas';

const statisticsRouter = express.Router();

statisticsRouter.get('/account_stats', getAccountStats);
statisticsRouter.get(
  '/record_stats',
  validate(getRecordStatsSchema),
  getRecordStats
);

export default statisticsRouter;
