import { Router } from 'express'
import { createUser, getAllUsers, updateUser, verifyUser, deleteUser, loginUser } from '../controllers/userController.js';
import { verifyJWTToken, isAdmin } from '../middlewares/index.js';

const userRouter = Router();

userRouter.post("/create", createUser);
userRouter.get('/get', verifyJWTToken, isAdmin, getAllUsers);
userRouter.post('/login', loginUser);
userRouter.post("/verify/:userId", verifyUser);
userRouter.patch("/update:userId", updateUser);
userRouter.delete("/delete:userId", verifyJWTToken, isAdmin, deleteUser);


export default userRouter