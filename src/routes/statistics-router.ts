import express from 'express';
import { getNetWorth } from 'src/controllers/statistics-controller';

const statisticsRouter = express.Router();

statisticsRouter.get('/netWorth', getNetWorth);

export default statisticsRouter;
