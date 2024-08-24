import { Router } from 'express'
import { addProduct, deleteSingleProduct, getProduct, getSingleProduct } from '../controllers/productController.js';

const productRoute = Router();

productRoute.post("/addProduct", addProduct);
productRoute.get("/getProduct", getProduct);
productRoute.route("/getProduct:id").get(getSingleProduct).delete(deleteSingleProduct);

export default productRoute