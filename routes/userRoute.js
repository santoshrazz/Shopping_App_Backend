import { Router } from 'express'
import { createUser, getAllUsers, updateUser, verifyUser, deleteUser } from '../controllers/userController.js';

const userRouter = Router();

userRouter.post("/create", createUser);
userRouter.get('/get', getAllUsers);
userRouter.post("/verify:userId", verifyUser);
userRouter.patch("/update:userId", updateUser);
userRouter.delete("/delete:userId", deleteUser);


export default userRouter