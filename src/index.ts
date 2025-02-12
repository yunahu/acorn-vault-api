import express from "express";
import logger from "morgan";
import routes from "src/routes";
import client from "src/services/postgres";
import env from "src/utils/env";

const app = express();

app.use(logger("dev"));

app.use("/", routes);

client.connect().then(() =>
  app.listen(env.PORT, () => {
    console.log(`Listening on port ${env.PORT}`);
  })
);
