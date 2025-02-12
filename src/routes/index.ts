import express from "express";
import pricesRouter from "src/routes/prices-router";

const router = express.Router();

router.use("/prices", pricesRouter);

export default router;
