import express from 'express';
import accountsRouter from 'src/routes/accounts-router';
import pricesRouter from 'src/routes/prices-router';
import recordsRouter from 'src/routes/records-router';

const router = express.Router();

router.use('/accounts', accountsRouter);
router.use('/prices', pricesRouter);
router.use('/records', recordsRouter);

export default router;
