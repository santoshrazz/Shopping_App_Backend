import { orderModel } from "../models/order.model.js";
import { ApiError, asyncHandler } from "../utils/error.js";

// ==============> Create new order (User)  <==============
const handleNewOrder = asyncHandler(async (req, res, next) => {
    // Receive data from req.body
    const { shippingInfo, subtotal, shippingCharges, discount, userId, tax, total, orderItem } = req.body;
    // Checking for null values
    if (!shippingInfo || !total || !orderItem || !subtotal || !userId) {
        return next(new ApiError("No required info provided to create an order", 400));
    }
    // Creating Orders
    const createdOrder = await orderModel.create({ shippingInfo, subtotal, discount, shippingCharges, tax, total, orderItem, userId });
    return res.status(201).json({ message: "Order created", success: true, createdOrder })
})

// ==============> Get All orders (Admin Only)  <==============
const getAllOrders = asyncHandler(async (req, res, next) => {
    const allOrders = await orderModel.find({}).populate('userId');
    if (allOrders.length <= 0) {
        return next(new ApiError("No orders to show", 400));
    }
    return res.status(200).json({ message: "Orders found", success: true, allOrders })
})
export { handleNewOrder, getAllOrders }