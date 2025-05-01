import express from 'express';
import {
  getSettings,
  updateSettings,
  deleteUser,
} from 'src/controllers/settings-controller';

const settingsRouter = express.Router();

settingsRouter.get('/', getSettings);
settingsRouter.patch('/', updateSettings);
settingsRouter.delete('/user', deleteUser);

export default settingsRouter;
