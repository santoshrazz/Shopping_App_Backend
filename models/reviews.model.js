import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
    star: {
        type: Number,
        required: [true, "Star required for reviews"],
    },
    comment: {
        type: String,
        required: [true, "Comment required while posting reviews"],
    },
    images: [
        {
            imageId: String,
            imageUrl: String,
        },
    ],
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
    },
});

const reviewModel =
    mongoose.models.review || mongoose.model("review", reviewSchema);

export default reviewModel;