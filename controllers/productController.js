import productModel from "../models/product.model.js";
import { ApiError, asyncHandler } from "../utils/error.js";

const getProduct = asyncHandler(async (_, res, next) => {
    const allProducts = await productModel.find();
    if (!allProducts) {
        return next(new ApiError("No Products to Show", 400));
    }
    res.status(200).json({ message: "Product found", success: true, allProducts })
})
const addProduct = asyncHandler(async (req, res, next) => {
    const { title, description, category, inStock, rating } = req.body;

    if (!title || !description || !category || !inStock) {
        next(new ApiError("No Required Data Provided", 404));
    }
    const createdProduct = await productModel.create({
        title, description, category, inStock, rating
    })
    if (!createdProduct) {
        return res.status(400).json({ message: "Failed to create Product", success: false })
    }
    return res.status(201).json({ message: "Product created", success: true, createdProduct })
})
export { getProduct, addProduct };