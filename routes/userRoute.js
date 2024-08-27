import { Router } from 'express'
import { createUser, getAllUsers, updateUser, verifyUser } from '../controllers/userController.js';

const userRouter = Router();

userRouter.post("/create", createUser);
userRouter.get('/get', getAllUsers);
userRouter.post("/verify:userId", verifyUser);
userRouter.patch("/update:userId", updateUser);


export default userRouter