import express from 'express';
import { authenticate } from 'src/middlewares/authenticators';
import accountsRouter from './accounts-router';
import cryptoRouter from './crypto-router';
import currenciesRouter from './currencies-router';
import recordsRouter from './records-router';
import settingsRouter from './settings-router';
import statisticsRouter from './statistics-router';

const router = express.Router();

router.use('/accounts', authenticate, accountsRouter);
router.use('/crypto', authenticate, cryptoRouter);
router.use('/currencies', currenciesRouter);
router.use('/records', authenticate, recordsRouter);
router.use('/settings', authenticate, settingsRouter);
router.use('/statistics', authenticate, statisticsRouter);

export default router;
