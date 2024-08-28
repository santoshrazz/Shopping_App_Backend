import express from 'express'
import cors from 'cors'
import productRoute from './routes/productRoute.js';
import { customErro } from './utils/error.js';
import userRouter from './routes/userRoute.js';
import NodeCache from 'node-cache'

const app = express();
export const myCache = new NodeCache();
app.use(express.json({ limit: "16kb" }));
app.use(cors());
// app.use("/api/v1/users", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/user", userRouter);

app.use(customErro);

export { app }