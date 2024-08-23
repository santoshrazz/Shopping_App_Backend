import express from 'express'
import cors from 'cors'
import productRoute from './routes/productRoute.js';
import { customErro } from './utils/error.js';

const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(cors());
// app.use("/api/v1/users", userRoute);
app.use("/api/v1/product", productRoute);

app.use(customErro);

export { app }