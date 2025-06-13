import express from 'express';
import {
  createUser,
  deleteUser,
  getUserSettings,
  updateUserSettings,
} from 'src/controllers/user-controller';
import validate from 'src/middlewares/validators';
import { updateUserSettingsSchema } from 'src/schemas/user-schemas';

const userRouter = express.Router();

userRouter.post('/', createUser);
userRouter.get('/', getUserSettings);
userRouter.patch('/', validate(updateUserSettingsSchema), updateUserSettings);
userRouter.delete('/', deleteUser);

export default userRouter;
