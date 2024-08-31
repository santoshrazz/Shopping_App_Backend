import { Router } from 'express'
import { deleteOrder, getAllOrders, getMyorder, handleNewOrder, updateOrderStatus } from '../controllers/orderController.js';
import { isAdmin, verifyJWTToken } from '../middlewares/index.js'

const orderRouter = Router();
orderRouter.post("/new-order", verifyJWTToken, handleNewOrder);
orderRouter.get("/admin-all", verifyJWTToken, isAdmin, getAllOrders);
orderRouter.get('/my-order', verifyJWTToken, getMyorder)
orderRouter.route('/:id').put(updateOrderStatus).delete(deleteOrder)



export default orderRouter