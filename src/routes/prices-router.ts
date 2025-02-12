import express, { NextFunction, Request, Response } from "express";
import { getPrices } from "src/controllers/prices-controller";

const router = express.Router();

const validateQuery = (req: Request, res: Response, next: NextFunction) => {
  if (
    typeof req.query.from !== "string" ||
    typeof req.query.to !== "string" ||
    typeof req.query.currency_id !== "string"
  )
    res.status(400).json({ message: "Error: Invalid query values" });

  next();
};

router.use("/", validateQuery, getPrices);

export default router;
