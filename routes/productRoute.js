import { Router } from 'express'
import { addProduct, deleteSingleProduct, getProduct, getProductByCategory, getSingleProduct, getTrendingProducts, searchProduct } from '../controllers/productController.js';
import { upload } from '../utils/multer.js';

const productRoute = Router();

productRoute.post("/addProduct", upload.array('images', 5), addProduct);
productRoute.get("/getProduct", getProduct);
productRoute.route("/getProduct:id").get(getSingleProduct).delete(deleteSingleProduct);
productRoute.get("/trending", getTrendingProducts);
productRoute.get("/category:category", getProductByCategory);
productRoute.get("/searchProduct", searchProduct)

export default productRoute