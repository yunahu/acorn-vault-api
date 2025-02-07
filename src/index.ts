import express from "express";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
