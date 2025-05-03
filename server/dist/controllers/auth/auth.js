"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.fetchUser = exports.changePassword = exports.logout = exports.refreshToken = exports.login = exports.registerUser = void 0;
const appError_1 = __importDefault(require("../../utils/appError"));
const Users_1 = require("../../models/Users");
const bcrypt_1 = __importDefault(require("bcrypt"));
const enums_1 = require("../../types/enums/enums");
const jwtUtils_1 = require("../../utils/jwtUtils");
const forgotPassword_1 = require("../../services/emails/triggers/customer/auth/forgotPassword");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configLinks_1 = require("../../config/configLinks");
// sign-up
const registerUser = async (req, res, next) => {
    const data = req.body;
    if (!data.email || !data.password || !data.role)
        throw new appError_1.default("Fields not found", 400);
    if (!Object.values(enums_1.RoleEnum).includes(data.role)) {
        return next(new appError_1.default("Invalid Role", 403));
    }
    const userExist = await Users_1.UserModel.exists({ email: data.email });
    if (userExist)
        throw new appError_1.default("User Already registered", 409);
    const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
    const user = await Users_1.UserModel.create({
        email: data.email,
        password: hashedPassword,
        role: data.role,
    });
    if (!user)
        throw new appError_1.default("User not created", 500);
    let accessToken = (0, jwtUtils_1.generateAccessToken)({
        id: String(user._id),
        role: user.role,
    });
    let refreshToken = (0, jwtUtils_1.generateRefreshToken)({
        id: String(user._id),
        role: user.role,
    });
    // Store the refresh token in user document (Optional)
    // await UserModel.findByIdAndUpdate(user._id, { refreshToken });
    return res.status(201).json({
        success: true,
        message: `User created successfuly with role of ${data.role}`,
        accessToken,
    });
};
exports.registerUser = registerUser;
// login-user
const login = async (req, res, next) => {
    const data = req.body;
    if (!data.email || !data.password || !data.role)
        return next(new appError_1.default("Fields not found", 400));
    const user = await Users_1.UserModel.findOne({ email: data.email });
    if (!user)
        return next(new appError_1.default("Email id not registered", 404));
    if (!(await bcrypt_1.default.compare(data.password, user.password)))
        return next(new appError_1.default("Invalid password", 403));
    let accessToken = (0, jwtUtils_1.generateAccessToken)({
        id: String(user._id),
        role: user.role,
    });
    let refreshToken = (0, jwtUtils_1.generateRefreshToken)({
        id: String(user._id),
        role: user.role,
    });
    await Users_1.UserModel.findByIdAndUpdate(user._id, { refreshToken });
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(200).json({
        success: true,
        message: "Login successfully",
        accessToken,
    });
};
exports.login = login;
const refreshToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return next(new appError_1.default("Refresh token is required", 403));
    }
    try {
        let user = await Users_1.UserModel.findOne({ refreshToken });
        if (!user) {
            return next(new appError_1.default("Invalid refresh token", 401));
        }
        const payload = (0, jwtUtils_1.verifyRefreshToken)(refreshToken);
        const newAccessToken = (0, jwtUtils_1.generateAccessToken)({
            id: payload.id,
            role: payload.role,
        });
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 2 * 60 * 60 * 1000, // 2 hours
        });
        res.status(200).json({ accessToken: newAccessToken });
    }
    catch (err) {
        next(new appError_1.default("Invalid refresh token", 403));
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken) {
        return next(new appError_1.default("Refresh token is required", 400));
    }
    try {
        let user = await Users_1.UserModel.findOneAndUpdate({ refreshToken }, { $unset: { refreshToken: "" } });
        if (!user) {
            return next(new appError_1.default("Invalid refresh token", 401));
        }
        res.status(200).clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res
            .status(200)
            .clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        })
            .json({ message: "Logged out successfully" });
    }
    catch (err) {
        next(new appError_1.default("Error logging out", 500));
    }
};
exports.logout = logout;
const changePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.id;
    if (!oldPassword || !newPassword) {
        return next(new appError_1.default("old and new passwords are required", 400));
    }
    const user = await Users_1.UserModel.findById(userId);
    if (!user) {
        return next(new appError_1.default("User not found", 404));
    }
    // is old passord correct
    const isOldPasswordCorrect = await bcrypt_1.default.compare(oldPassword, user.password);
    if (!isOldPasswordCorrect) {
        return next(new appError_1.default("Old password is incorrect", 401));
    }
    // hasing passowrd
    const hashedNewPassword = await bcrypt_1.default.hash(newPassword, 10);
    // updating new password
    user.password = hashedNewPassword;
    const updatedUser = await user.save();
    if (!updatedUser)
        throw new appError_1.default("Failed to change password", 500);
    return res.status(201).json({
        success: true,
        message: "Password Updated Successfully",
    });
};
exports.changePassword = changePassword;
// sending email with reset password url
// export const resetPasswordToken = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<Response | void> => {
//   const { email } = req.body;
//   if (!email) throw new AppError("Email not found", 404);
//   const user = await UserModel.findOne({ email: email });
//   if (!user) throw new AppError("Email is not registered", 401);
//   const resetPasswordToken = crypto.randomUUID();
//   const updatedUser = await UserModel.findOneAndUpdate(
//     { email: email },
//     {
//       resetPasswordToken: resetPasswordToken,
//       resetPasswordExpires: Date.now() + 10 * 60 * 1000, // 10 minutes vaidation
//     },
//     { new: true }
//   );
//   const baseURL = process.env.FRONTEND_BASE_URL;
//   const url: string = `${baseURL}/reset-password/${resetPasswordToken}`;
//   if (!updatedUser) throw new AppError("Database operation error", 501);
//   return res.status(200).json({
//     success: true,
//     message: "Reset Passwprd link is sended on registered email",
//   });
// };
// export const resetPassword = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { password, confirmPassword, token } = req.body;
//   if (!password || !confirmPassword || !token)
//     throw new AppError("Field not found", 404);
//   if (password !== confirmPassword)
//     throw new AppError("Password did'nt match", 401);
//   const userDetail = await UserModel.findOne({ resetPasswordToken: token });
//   if (!userDetail) throw new AppError("User not found", 404);
//   if (userDetail.resetPasswordExpires.getTime() < Date.now())
//     throw new AppError("Link is expired, try again", 402);
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const updatedUser = await UserModel.findOneAndUpdate(
//     { resetPasswordToken: token },
//     {
//       password: hashedPassword,
//       resetPasswordToken: null,
//     },
//     { new: true }
//   );
//   if (!updatedUser) throw new AppError("Failed to update Password", 410);
//   return res.status(200).json({
//     success: true,
//     message: "Password updated successfuly",
//   });
// };
const fetchUser = async (req, res) => {
    if (req.admin) {
        return res.status(200).json({
            success: true,
            message: "Login successfully",
            role: req?.admin?.role
        });
    }
    else if (req.user) {
        return res.status(200).json({
            success: true,
            message: "Login successfully",
            role: req?.user?.role
        });
    }
    return res.status(401).json({
        success: false,
        message: "User not authenticated",
    });
};
exports.fetchUser = fetchUser;
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }
        // Find user by email
        const user = await Users_1.UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User with this email does not exist." });
        }
        // Generate JWT token valid for 10 mins
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
        // Set token and expiry in DB (optional but good for token invalidation)
        user.forgotPasswordToken = token;
        user.forgotPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save({ validateBeforeSave: false });
        // Build reset link
        const resetLink = `${configLinks_1.PORTAL_LINK}/reset-password/${token}`;
        //for testing
        // const resetLink =`http://localhost:5173/reset-password/${token}` 
        // Send email
        await (0, forgotPassword_1.sendForgotPasswordEmail)(user.name, resetLink, user.email);
        return res.status(200).json({ message: "Password reset link sent successfully." });
    }
    catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        // Check if token and new password are provided
        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required." });
        }
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // Find user by token
        const user = await Users_1.UserModel.findOne({
            forgotPasswordToken: token,
            forgotPasswordExpires: { $gt: new Date() } // Ensure the token hasn't expired
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }
        // Check if token matches and hasn't expired
        if (decoded.userId !== user._id.toString()) {
            return res.status(400).json({ message: "Token does not belong to this user." });
        }
        // Hash the new password
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        // Update user password
        user.password = hashedPassword;
        user.forgotPasswordToken = null;
        user.forgotPasswordExpires = null;
        await user.save({ validateBeforeSave: false });
        return res.status(200).json({ message: "Password reset successfully." });
    }
    catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
};
exports.resetPassword = resetPassword;
