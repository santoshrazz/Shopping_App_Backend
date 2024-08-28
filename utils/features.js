import { myCache } from "../app.js"
import productModel from "../models/product.model.js";

export const clearCache = async ({ product, order = false, admin = false }) => {
    if (product) {
        const productArray = ['allProducts', 'trending-products']
        const singleProductArrayId = await productModel.find({}).select("_id");
        singleProductArrayId.forEach(element => {
            productArray.push(`singleProduct-${element._id}`);
        });
        myCache.del(productArray);
    }
}