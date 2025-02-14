import express from "express";
import accountsRouter from "src/routes/accounts-router";
import pricesRouter from "src/routes/prices-router";

const router = express.Router();

router.use("/accounts", accountsRouter);
router.use("/prices", pricesRouter);

export default router;
