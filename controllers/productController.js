import { myCache } from "../app.js";
import productModel from "../models/product.model.js";
import uploadToCloudinery from "../utils/cloudinery.js";
import { ApiError, asyncHandler } from "../utils/error.js";
import { clearCache } from "../utils/features.js";

const getProduct = asyncHandler(async (_, res, next) => {
    let allProducts;
    if (myCache.has('allProducts')) {
        allProducts = JSON.parse(myCache.get('allProducts'))
    }
    else {
        allProducts = await productModel.find();
        if (!allProducts) {
            return next(new ApiError("No Products to Show", 400));
        }
        myCache.set('allProducts', JSON.stringify(allProducts));
    }
    res.status(200).json({ message: "Product found", success: true, allProducts })
})
const getSingleProduct = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    if (!id) {
        return next(new ApiError("Invalid Id", 404));
    }
    let singleProduct;
    if (myCache.has(`singleProduct-${id}`)) {
        singleProduct = JSON.parse(myCache.get(`singleProduct-${id}`))
    }
    else {
        singleProduct = await productModel.findById(id);
        if (!singleProduct) {
            return next(new ApiError("Cann't Find Product", 404));
        }
        myCache.set(`singleProduct-${id}`, JSON.stringify(singleProduct))
    }
    return res.status(200).json({ message: "Product found", success: true, singleProduct })
})
const getTrendingProducts = asyncHandler(async (req, res, next) => {
    let trendingProducts;
    if (myCache.has('trending-products')) {
        trendingProducts = JSON.parse(myCache.get('trending-products'))
    }
    else {
        trendingProducts = await productModel.find({}).sort({ "createdAt": -1 }).limit(5);
        if (!trendingProducts) {
            return next(new ApiError("No Product To Show", 404));
        }
        myCache.set('trending-products', JSON.stringify(trendingProducts));
    }
    return res.status(200).json({ message: "Product found", success: true, trendingProducts })
})

//---------------------------> Add Product <------------------------------
const addProduct = asyncHandler(async (req, res, next) => {
    const { title, description, category, inStock, rating, price } = req.body;

    // If photo is present then upload it to cloudinery
    const photosArray = [];
    const files = req.files;
    for (const file of files) {
        const { path } = file;
        const newPath = await uploadToCloudinery(path)
        photosArray.push({ imageUrl: newPath });
    }
    console.log(`Photos Array is `, photosArray);

    if (!title || !description || !category || !inStock || !price) {
        next(new ApiError("No Required Data Provided", 404));
    }
    const createdProduct = await productModel.create({

        title, description, category, inStock, rating, price,
        images: photosArray,
    })
    if (!createdProduct) {
        return res.status(400).json({ message: "Failed to create Product", success: false })
    }
    // Clear caching
    clearCache({ product: true });
    return res.status(201).json({ message: "Product created", success: true, createdProduct })
})


const deleteSingleProduct = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    if (!id) {
        return next(new ApiError("Invalid Id", 404));
    }
    const deletedProduct = await productModel.findByIdAndDelete(id);
    if (!deletedProduct) {
        return next(new ApiError("Error deleting Product", 404));
    }
    // clear caching
    clearCache({ product: true })
    return res.status(200).json({ message: "Product Deleted Successfully", success: true })
})

const searchProduct = asyncHandler(async (req, res, next) => {
    const { search, price, category, sort } = req.query;
    console.log(search);
    const page = Number(req.query.page) || 1;
    const limit = process.env.PRODUCT_LIMIT || 10;
    const skip = (page - 1) * limit;
    const baseQuery = {};
    if (search) {
        baseQuery.title = {
            $regex: search,
            $options: "i",
        }
    }
    if (price) {
        baseQuery.price = {
            $lte: Number(price)
        }
    }
    if (category) {
        baseQuery.category = category;
    }
    const productPromise = productModel.find(baseQuery).sort(sort && { price: sort === "asc" ? 1 : -1 }).limit(limit).skip(skip);
    const [products, filteredOnlyProducts] = await Promise.all([productPromise, productModel.find(baseQuery)]);
    const totalNoOfPage = Math.ceil(filteredOnlyProducts.length / products.length)

    return res.status(200).json({ message: "Success", success: true, products, NoofPages: totalNoOfPage })
})


const getProductByCategory = asyncHandler(async (req, res, next) => {
    const category = req.query;
    console.log(category);
    if (!category) {
        return next(new ApiError("No Category Found", 404));
    }
    const productsByCategory = await productModel.find({ category });
    if (!productsByCategory) {
        return res.status(400).json({ message: "No Product found", success: false })
    }
    return res.status(400).json({ message: "No found", success: true, productsByCategory })
})
export { getProduct, addProduct, getSingleProduct, deleteSingleProduct, searchProduct, getTrendingProducts, getProductByCategory };