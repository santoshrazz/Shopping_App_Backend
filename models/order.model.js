import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true
        },
        landMark: {
            type: String,
        },
        pincode: {
            type: Number,
            required: true,
        },
        city: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    subtotal: {
        type: Number,
        required: true,
    },
    shippingCharges: {
        type: Number,
        required: true,
        default: 0
    },
    discount: {
        type: Number,
        required: true,
        default: 0
    },
    tax: {
        type: Number,
        required: true,
        default: 0
    },
    total: {
        type: Number,
        required: true,
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ["Processing", "Shipped", "Delivered"],
        default: "Processing"
    },
    orderItem: [{
        title: {
            type: String
        },
        photo: {
            type: String
        },
        price: {
            type: Number
        },
        quantity: {
            type: Number
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
        }
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }

}, {
    timestamps: true
});

export const orderModel = mongoose.model("order", orderSchema);
