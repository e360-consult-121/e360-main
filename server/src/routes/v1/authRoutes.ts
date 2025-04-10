import express from "express"
import * as authControllers from "../../controllers/auth/auth"
import asyncHandler from "../../utils/asyncHandler"
import { authenticate } from "../../middlewares/authenticate"

const router = express.Router()

router.post("/login", asyncHandler(authControllers.login))
router.post("/logout", asyncHandler(authControllers.logout))
router.post("/register", asyncHandler(authControllers.registerUser))
router.post("/refresh-token", asyncHandler(authControllers.refreshToken))
router.post("/forget-password", asyncHandler(authControllers.resetPasswordToken));
router.post("/reset-password", asyncHandler(authControllers.resetPassword));
router.put("/change-password", authenticate, asyncHandler(authControllers.changePassword))
router.get("/fetch-user", authenticate, asyncHandler(authControllers.fetchUser))

export default router