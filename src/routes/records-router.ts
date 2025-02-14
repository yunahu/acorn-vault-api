import express from 'express';
import {
  createRecord,
  deleteRecord,
  records,
  updateRecord,
} from 'src/controllers/records-controller';

const recordsRouter = express.Router();

recordsRouter.get('/', records);
recordsRouter.post('/', createRecord);
recordsRouter.patch('/:id', updateRecord);
recordsRouter.delete('/:id', deleteRecord);

export default recordsRouter;
