import { NextFunction, Request, Response } from "express";
import AppError from "../../utils/appError";
import { UserModel } from "../../models/Users";
import bcrypt from "bcrypt";
import { RoleEnum } from "../../types/enums/enums";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwtUtils";


// sign-up
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const data = req.body;

  if (!data.email || !data.password || !data.role)
    throw new AppError("Fields not found", 400);

  if (!Object.values(RoleEnum).includes(data.role)) {
    return next(new AppError("Invalid Role", 403));
  }

  const userExist = await UserModel.exists({ email: data.email });
  if (userExist)
    throw new AppError("User Already registered", 409);

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await UserModel.create({
    email: data.email,
    password: hashedPassword,
    role: data.role
  });

  if (!user)
    throw new AppError("User not created", 500);

  return res.status(201).json({
    success: true,
    message: `User created successfuly with role of ${data.role}`
  })
}


// login-user
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const data = req.body;
  
  if (!data.email || !data.password || !data.role)
    return next(new AppError("Fields not found", 400))

  const user = await UserModel.findOne({ email: data.email })
  if (!user)
    return next(new AppError("Email id not registered", 404))

  if (!(await bcrypt.compare(data.password, user.password)))
    return next(new AppError("Invalid password", 403))

  let accessToken = generateAccessToken({ id: String(user._id), role: user.role });
  let refreshToken = generateRefreshToken({ id: String(user._id), role: user.role });

  await UserModel.findByIdAndUpdate(user._id, { refreshToken });

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
    success:true, 
    message: "Login successfully"
  })
}



export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return next(
      new AppError("Refresh token is required", 403)
    );
  }

  try {
    let user = await UserModel.findOne({ refreshToken });

    if (!user) {
      return next(new AppError("Invalid refresh token", 401));
    }

    const payload = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken({
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
  } catch (err: any) {
    next(new AppError("Invalid refresh token", 403));
  }
}

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return next(
      new AppError("Refresh token is required", 400)
    );
  }

  try {
    let user = await UserModel.findOneAndUpdate(
      { refreshToken },
      { $unset: { refreshToken: "" } }
    );

    if (!user) {
      return next(
        new AppError("Invalid refresh token", 401)
      );
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
  } catch (err: any) {
    next(new AppError("Error logging out", 500));
  }
}

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<Response | void> => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user?.id;

  if (!oldPassword || !newPassword) {
      return next(new AppError("old and new passwords are required", 400));
  }

  const user = await UserModel.findById(userId);
  if (!user) {
      return next(new AppError("User not found", 404));
  }

  // is old passord correct
  const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
  if (!isOldPasswordCorrect) {
      return next(new AppError("Old password is incorrect", 401));
  }

  // hasing passowrd
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  // updating new password
  user.password = hashedNewPassword;
  const updatedUser = await user.save();
  if(!updatedUser)
    throw new AppError("Failed to change password", 500);

  return res.status(201).json({
      success: true,
      message: "Password Updated Successfully"
  });
}

// sending email with reset password url
export const resetPasswordToken = async (req: Request,
  res: Response,
  next: NextFunction
):Promise<Response | void> => {

  const { email } = req.body;

  if (!email)
      throw new AppError("Email not found", 404);

  const user = await UserModel.findOne({ email: email });
  if (!user)
      throw new AppError("Email is not registered", 401);

  const resetPasswordToken = crypto.randomUUID();

  const updatedUser = await UserModel.findOneAndUpdate(
      { email: email },
      {
          resetPasswordToken: resetPasswordToken,
          resetPasswordExpires: Date.now() + 10 * 60 * 1000,                                // 10 minutes vaidation
      },
      { new: true }
  );

  const baseURL = process.env.FRONTEND_BASE_URL;
  const url: string = `${baseURL}/reset-password/${resetPasswordToken}`;

  if (!updatedUser)
      throw new AppError("Database operation error", 501);

  return res.status(200).json({
      success: true,
      message: "Reset Passwprd link is sended on registered email",
  })
}

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password, confirmPassword, token } = req.body;

  if (!password || !confirmPassword || !token)
      throw new AppError("Field not found", 404);

  if (password !== confirmPassword)
      throw new AppError("Password did'nt match", 401);

  const userDetail = await UserModel.findOne({ resetPasswordToken: token });
  if (!userDetail)
      throw new AppError("User not found", 404);

  if (userDetail.resetPasswordExpires.getTime() < Date.now())
      throw new AppError("Link is expired, try again", 402);

  const hashedPassword = await bcrypt.hash(password, 10);

  const updatedUser = await UserModel.findOneAndUpdate(
      { resetPasswordToken: token },
      {
          password: hashedPassword,
          resetPasswordToken: null
      },
      { new: true }
  );

  if (!updatedUser)
      throw new AppError("Failed to update Password", 410);

  return res.status(200).json({
      success: true,
      message: "Password updated successfuly"
  })
}