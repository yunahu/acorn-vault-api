import express from 'express';
import { getCoinPrices, getCoins } from 'src/controllers/crypto-controller';

const cryptoRouter = express.Router();

cryptoRouter.get('/', getCoins);
cryptoRouter.get('/prices', getCoinPrices);

export default cryptoRouter;
