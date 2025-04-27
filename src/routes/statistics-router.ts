import express from 'express';
import {
  getNetWorth,
  getNetWorthByCurrency,
} from 'src/controllers/statistics-controller';

const statisticsRouter = express.Router();

statisticsRouter.get('/netWorth', getNetWorth);
statisticsRouter.get('/netWorthByCurrency', getNetWorthByCurrency);

export default statisticsRouter;
