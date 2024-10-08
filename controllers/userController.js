import { ApiError, asyncHandler } from "../utils/error.js";
import sendEmail from '../utils/nodemailer.js'
import { userModel } from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

const createUser = asyncHandler(async (req, res, next) => {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !password) {
        return next(new ApiError("No required data to create user"))
    }

    // ===> check if user already exists
    const isExistedUser = await userModel.findOne({ email });
    if (isExistedUser) {
        if (isExistedUser.isVerified) {
            return next(new ApiError("User already exists with this email", 404));
        }
        else {
            const verifyToken = Math.floor(100000 + Math.random() * 900000);
            const message = {
                name,
                subject: "User Verification",
                OTP: verifyToken
            }
            const mailResponse = await sendEmail(email, message)
            if (!mailResponse) {
                return next(new ApiError("Faild to send email to user"));
            }
            isExistedUser.verifyToken = verifyToken;
            isExistedUser.verifyTokenExpiry = Date.now() + 3600000;
            await isExistedUser.save();
            return res.status(200).json({ message: "New otp send check your email and verify your account", success: true })
        }
    }

    // ====> if user Account doesn't exist
    // ---> Sending OTP to user's email
    const verifyToken = Math.floor(100000 + Math.random() * 900000);
    const message = {
        name,
        subject: "User Verification",
        OTP: verifyToken
    }
    const mailResponse = await sendEmail(email, message)
    if (!mailResponse) {
        return next(new ApiError("Faild to send email to user"));
    }

    // ========> Encrypting Password <=======
    let hashedPassword;
    if (password) {
        hashedPassword = await bcryptjs.hash(password, 10)
    }
    // ========> creating User <========
    const createdUser = await userModel.create({
        name,
        email, phone,
        password: hashedPassword,
        role,
        verifyToken
    });
    if (!createUser) {
        return next(new ApiError("Faild in creating user Account"));
    }
    return res.status(201).json({ message: "User created", success: true, createdUser })
})

//==========> Function to get All Users <=============
const getAllUsers = asyncHandler(async (req, res, next) => {
    // Fetch all users from the database
    const users = await userModel.find();

    // Check if users exist
    if (!users.length) {
        return next(new ApiError("No users found", 404));
    }

    return res.status(200).json({
        message: "Users retrieved successfully",
        success: true,
        users
    });
});

// =========> Login User  <=============
const loginUser = asyncHandler(async (req, res, next) => {

    // ---> Getting data from req.body  <-----
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ApiError("Email or password require", 400));
    }
    // ---> Finding User  <-----
    const user = await userModel.findOne({ email });
    if (!user) {
        return next(new ApiError("Not an account please create a account first", 400));
    }
    console.log(`user`, user);
    // ---> checking user verified or not. If not then send new verification token to user <-------
    if (!user.isVerified) {
        const verifyToken = Math.floor(100000 + Math.random() * 900000);
        const message = {
            name: user.name,
            subject: "User Verification",
            OTP: verifyToken
        }
        const mailResponse = await sendEmail(user.email, message)
        if (!mailResponse) {
            return next(new ApiError("Faild to send email to user"));
        }
        user.verifyToken = verifyToken;
        user.verifyTokenExpiry = Date.now() + 3600000;
        await user.save();
        return res.status(200).json({ message: "Please verify your account first", success: true })
    }
    const comparedPassword = await bcryptjs.compare(password, user.password);
    if (!comparedPassword) {
        return next(new ApiError("Password Doesn't Match", 400));
    }
    const payload = {
        id: user._id,
        name: user.name
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET)
    res.cookie('token', token, { httpOnly: true })
    res.status(201).json({ message: "Logged in successfully", status: true, token })
})
// =========> updatingUser <========
const updateUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params; // Assuming userId is passed as a route parameter
    const updateData = req.body; // Data to update, passed in the request body

    // Check if user exists
    const user = await userModel.findById(userId);
    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    // Update user fields
    Object.keys(updateData).forEach(key => {
        user[key] = updateData[key];
    });

    // Save updated user
    const updatedUser = await user.save();

    return res.status(200).json({
        message: "User updated successfully",
        success: true,
        updatedUser
    });
});

// =========> Verify User <========
const verifyUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const { otp } = req.body;

    // Check if email and OTP are provided
    if (!userId || !otp) {
        return next(new ApiError("UserId and OTP are required", 400));
    }

    // Find user by email
    const user = await userModel.findById(userId);
    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    // Check if user is already verified
    if (user.isVerified) {
        return next(new ApiError("User is already verified", 400));
    }
    // Check if OTP has expired
    const currentTime = new Date();
    if (user.verifyTokenExpiry < currentTime) {
        return next(new ApiError("OTP has expired", 400));
    }
    // Check if OTP matches
    if (user.verifyToken !== otp && user.verifyTokenExpiry) {
        return next(new ApiError("Invalid OTP", 400));
    }

    // If OTP matches, mark the user as verified
    user.isVerified = true;
    user.verifyToken = null; // Clear the OTP after verification
    user.verifyTokenExpiry = null;

    // Save the updated user
    await user.save();

    return res.status(200).json({
        message: "User verified successfully",
        success: true,
    });
});

const deleteUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const deletedUser = await userModel.findByIdAndDelete(userId);
    if (!deleteUser) {
        return next(new ApiError("Unable to delete User", 400));
    }
    res.status(200).json({ success: true, message: "User Deleted" });
})
export { createUser, updateUser, verifyUser, getAllUsers, deleteUser, loginUser }