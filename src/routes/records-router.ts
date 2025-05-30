import express from 'express';
import {
  createRecord,
  deleteRecord,
  getRecords,
  updateRecord,
} from 'src/controllers/records-controller';
import validate from 'src/middlewares/validators';
import {
  createRecordSchema,
  deleteRecordSchema,
  getRecordsSchema,
  updateRecordSchema,
} from 'src/schemas/recordSchemas';

const recordsRouter = express.Router();

recordsRouter.post('/', validate(createRecordSchema), createRecord);
recordsRouter.get('/', validate(getRecordsSchema), getRecords);
recordsRouter.patch('/:id', validate(updateRecordSchema), updateRecord);
recordsRouter.delete('/:id', validate(deleteRecordSchema), deleteRecord);

export default recordsRouter;
