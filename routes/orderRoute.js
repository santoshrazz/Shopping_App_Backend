import { Router } from 'express'
import { getAllOrders, handleNewOrder } from '../controllers/orderController.js';

const orderRouter = Router();
orderRouter.post("/new-order", handleNewOrder);
orderRouter.get("/admin-all", getAllOrders);



export default orderRouter