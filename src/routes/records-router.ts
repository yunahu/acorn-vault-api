import express from 'express';
import {
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord,
} from 'src/controllers/records-controller';

const recordsRouter = express.Router();

recordsRouter.get('/', getRecords);
recordsRouter.post('/', createRecord);
recordsRouter.patch('/:id', updateRecord);
recordsRouter.delete('/:id', deleteRecord);

export default recordsRouter;
