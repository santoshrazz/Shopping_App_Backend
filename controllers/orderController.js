import { orderModel } from "../models/order.model.js";
import { ApiError, asyncHandler } from "../utils/error.js";

// ==============> Create new order (User)  <==============
const handleNewOrder = asyncHandler(async (req, res, next) => {
    // Receive data from req.body
    const { shippingInfo, subtotal, shippingCharges, discount, tax, total, orderItem } = req.body;
    const userId = req.user.id;
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
    const allOrders = await orderModel.find({}).populate('userId', "name");
    if (allOrders.length <= 0) {
        return next(new ApiError("No orders to show", 400));
    }
    return res.status(200).json({ message: "Orders found", success: true, allOrders })
})

// ==============> My order (User)   <==============
const getMyorder = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    if (!userId) {
        return next(new ApiError("No user id found to show orders"), 400);
    }
    const orders = await orderModel.find({ userId });
    if (!orders) {
        return next(new ApiError("Unable to find order"), 500);
    }
    if (orders.length <= 0) {
        return res.status(200).json({ message: "No orders", success: true })
    }
    return res.status(200).json({ message: "Here's the list of orders", success: true, orders })

})

const updateOrderStatus = asyncHandler(async (req, res, next) => {
    const orderId = req.params.id;
    if (!orderId) {
        return next(new ApiError("No order id found"), 400);
    }
    const order = await orderModel.findById(orderId);
    if (!order) {
        return next(new ApiError("Unable to find order with the id"), 400);
    }
    switch (order.orderStatus) {
        case "Processing":
            order.orderStatus = "Shipped"
            break;
        case "Shipped":
            order.orderStatus = "Delivered"
        default:
            order.orderStatus = "Delivered"
            break;
    }
    const updatedOrder = await order.save();
    res.status(200).json({ message: "Order updated successfully", updatedOrder });
})
const deleteOrder = asyncHandler(async (req, res, next) => {
    const orderId = req.params.id;
    if (!orderId) {
        return next(new ApiError("No order id found"), 400);
    }
    await orderModel.findByIdAndDelete(orderId)
    res.status(200).json({ message: "Order deleted", success: true });
})
export { handleNewOrder, getAllOrders, updateOrderStatus, deleteOrder, getMyorder }