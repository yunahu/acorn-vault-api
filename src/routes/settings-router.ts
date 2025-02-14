import express from 'express';
import {
  getSettings,
  updateSettings,
} from 'src/controllers/settings-controller';

const settingsRouter = express.Router();

settingsRouter.get('/', getSettings);
settingsRouter.patch('/', updateSettings);

export default settingsRouter;
