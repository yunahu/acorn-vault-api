import express from "express";
import {
  accounts,
  createAccount,
  deleteAccount,
  updateAccount,
} from "src/controllers/accounts-controller";

const accountsRouter = express.Router();

accountsRouter.get("/", accounts);
accountsRouter.post("/", createAccount);
accountsRouter.patch("/:id", updateAccount);
accountsRouter.delete("/:id", deleteAccount);

export default accountsRouter;
