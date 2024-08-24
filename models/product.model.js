import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Product Title required"],
    },
    description: {
        type: String,
        required: [true, "Product name required"],
    },
    price: {
        type: Number,
        required: [true, "Product price is required"]
    },
    images: [
        {
            imageUrl: {
                type: String,
            },
        },
    ],
    category: {
        type: String,
        required: [true, "Product Category Required"],
        enum: {
            values: [
                "Electronics",
                "Cameras",
                "Mobiles",
                "Laptops",
                "Headphones",
                "Sports",
                "Accessories",
            ],
            message: "Please select correct category",
        },
    },
    inStock: {
        type: Number,
        required: [true, "in stock required"],
    },
    rating: {
        type: Number,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "review",
        },
    ],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
}, {
    timestamps: true
});

const productModel =
    mongoose.models.products || mongoose.model("products", productSchema);

export default productModel;