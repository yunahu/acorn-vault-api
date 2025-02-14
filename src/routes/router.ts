import express from 'express';
import accountsRouter from './accounts-router';
import pricesRouter from './prices-router';
import recordsRouter from './records-router';
import settingsRouter from './settings-router';

const router = express.Router();

router.use('/accounts', accountsRouter);
router.use('/prices', pricesRouter);
router.use('/records', recordsRouter);
router.use('/settings', settingsRouter);

export default router;
