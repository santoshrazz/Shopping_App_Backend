import { ApiError, asyncHandler } from "../utils/error.js";
import sendEmail from '../utils/nodemailer.js'

const createUser = asyncHandler(async (req, res, next) => {
    console.log(`Working...`);
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !password) {
        return next(new ApiError("No required data to create user"))
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const message = {
        name,
        subject: "User Verification",
        OTP: otp
    }
    const mailResponse = await sendEmail(email, message)
    console.log(`mail response is`, mailResponse);
    return mailResponse;
})
export { createUser }