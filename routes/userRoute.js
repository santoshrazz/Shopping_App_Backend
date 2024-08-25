import { Router } from 'express'
import { createUser } from '../controllers/userController.js';

const userRouter = Router();

userRouter.route('/create').post(createUser);

export default userRouter