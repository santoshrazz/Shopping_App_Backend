import { ApiError, asyncHandler } from "../utils/error.js";
import { userModel } from '../models/user.model.js'
import jwt from 'jsonwebtoken'
export const verifyJWTToken = asyncHandler(async (req, res, next) => {
    const cookie = req.headers.authorization.split(" ")[1] || req.cookie('token');
    if (!cookie) {
        return next(new ApiError("No token found for login", 400));
    }
    const { id } = jwt.verify(cookie, process.env.JWT_SECRET);
    const user = await userModel.findById(id);
    req.user = user;
    next();
})
export const isAdmin = asyncHandler(async (req, res, next) => {
    console.log(req.user);
    if (req.user.role === "admin") {
        return next();
    }
    next(new ApiError("Admin only route", 400));
})