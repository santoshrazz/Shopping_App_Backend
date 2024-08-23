import { Router } from 'express'
import { addProduct, getProduct } from '../controllers/productController.js';

const productRoute = Router();

productRoute.get("/getProduct", getProduct);
productRoute.post("/addProduct", addProduct);

export default productRoute