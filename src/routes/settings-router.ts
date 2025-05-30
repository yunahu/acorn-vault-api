import express from 'express';
import {
  deleteUser,
  getSettings,
  updateSettings,
} from 'src/controllers/settings-controller';
import validate from 'src/middlewares/validators';
import { updateSettingsSchema } from 'src/schemas/settingsSchemas';

const settingsRouter = express.Router();

settingsRouter.get('/', getSettings);
settingsRouter.patch('/', validate(updateSettingsSchema), updateSettings);
settingsRouter.delete('/user', deleteUser);

export default settingsRouter;
