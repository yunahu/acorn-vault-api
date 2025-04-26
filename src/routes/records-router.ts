import express from 'express';
import {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
} from 'src/controllers/records-controller';

const recordsRouter = express.Router();

recordsRouter.post('/', createRecord);
recordsRouter.get('/', getRecords);
recordsRouter.patch('/:id', updateRecord);
recordsRouter.delete('/:id', deleteRecord);

export default recordsRouter;
