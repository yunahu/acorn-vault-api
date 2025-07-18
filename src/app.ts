import cors from 'cors';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import express from 'express';
import logger from 'morgan';
import routes from 'src/routes/router';
import client from 'src/services/postgres-service';
import env from 'src/utils/env';

dayjs.extend(utc);

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use('/', routes);

client.connect().then(() =>
  app.listen(env.PORT, () => {
    console.log(`Listening on port ${env.PORT}`);
  })
);
