import express from 'express';
import { settings, updateSettings } from 'src/controllers/settings-controller';

const settingsRouter = express.Router();

settingsRouter.get('/', settings);
settingsRouter.patch('/', updateSettings);

export default settingsRouter;
