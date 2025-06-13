import { Response } from 'express';
import {
  CreateRecordRequest,
  DeleteRecordRequest,
  GetRecordsRequest,
  UpdateRecordRequest,
} from 'src/schemas/records-schemas';
import * as recordsService from 'src/services/records-service';

export const createRecord = async (req: CreateRecordRequest, res: Response) => {
  const { date, description, account_id, amount } = req.body;
  const newRecord = await recordsService.createRecord(
    date,
    description,
    account_id,
    amount,
    req.user.uid
  );
  newRecord ? res.sendStatus(204) : res.sendStatus(500);
};

export const getRecords = async (req: GetRecordsRequest, res: Response) => {
  const { from, to } = req.query;
  const records = await recordsService.getRecords(req.user.uid, from, to);
  res.json(records);
};

export const updateRecord = async (req: UpdateRecordRequest, res: Response) => {
  const result = await recordsService.updateRecord(
    req.user.uid,
    req.params.id,
    req.body
  );
  result ? res.sendStatus(204) : res.sendStatus(500);
};

export const deleteRecord = async (req: DeleteRecordRequest, res: Response) => {
  const deletedRecord = await recordsService.deleteRecord(
    req.params.id,
    req.user.uid
  );
  deletedRecord ? res.sendStatus(204) : res.sendStatus(500);
};
