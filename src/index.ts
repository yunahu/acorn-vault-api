import express from "express";
import logger from "morgan";
import env from "./utils/env";

const app = express();

app.use(logger("dev"));

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.listen(env.PORT, () => {
  console.log(`Listening on port ${env.PORT}`);
});
