import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name required to create account"]
    },
    email: {
        type: String,
        required: [true, "User email required"],
        unique: [true, "User already exists"],
        trim: true
    },
    phone: {
        type: Number,
    },
    password: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyToken: {
        type: String,
    },
    verifyTokenExpirty: {
        type: Date,
        default: Date.now() + 3600000,
    },
    userAvatarImage: {
        type: String
    },
    userAddress: {
        type: String
    },
    role: {
        type: String,
        required: [true, "User role required"],
        enum: {
            values: ["admin", "user", "seller"]
        },
        default: "user"
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
        }
    ],
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
    }]
}, {
    timestamps: true
})

export const userModel = mongoose.model("user", userSchema);