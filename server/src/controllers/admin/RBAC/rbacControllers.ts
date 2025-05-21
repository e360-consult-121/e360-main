import { NextFunction, Request, Response } from "express";
import mongoose, { Schema, Document } from "mongoose";
import AppError from "../../../utils/appError";
import  { Types } from "mongoose";
import { UserModel as userModel } from "../../../models/Users";
import { RoleModel as roleModel } from "../../../models/rbacModels/roleModel";
import { ActionModel as actionModel } from "../../../models/rbacModels/actionModel";
import { FeatureModel as featureModel } from "../../../models/rbacModels/featureModel";
import { PermissionModel as permissionModel } from "../../../models/rbacModels/permissionModel";
import bcrypt from "bcryptjs";
import {
  RoleEnum,
  AccountStatusEnum,
} from "../../../types/enums/enums";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../utils/jwtUtils";

// This is utility function 
export const createRoleWithOptionalPermissions = async (
  roleName: string,
  actionIds: string[] = []
) => {
  const existingRole = await roleModel.findOne({ name: roleName });

  if (existingRole) {
    return { role: existingRole, alreadyExisted: true };
  }

  // Create new role
  const newRole = await roleModel.create({ name: roleName });

  // If actionIds are provided, create permissions
  if (actionIds.length > 0) {
    const permissions = actionIds.map(actionId => ({
      roleId: newRole._id,
      actionId,
    }));

    await permissionModel.insertMany(permissions);
  }

  return { roleDoc: newRole, alreadyExisted: false };
};


// 1st
export const addNewRole = async (req: Request, res: Response) => {
  const { name, actionIds } = req.body;

  
};

  
// 2nd
// add new user and also assign role(existing ) or create new 
export const addNewAdminUser = async (req: Request, res: Response) => {
  const {
    name,
    email,
    phone,
    nationality,
    password,
    roleName , 
    actionIds = [], // optional
  } = req.body;

  if (!name || !email || !phone || !password || !roleName) {
    res.status(400);
    throw new Error("Missing required fields.");
  }

  // Check if the user already exists
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    res.status(409);
    throw new Error("User with this email already exists.");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  

  // Create role or get existing one
  const { roleDoc, alreadyExisted } = await createRoleWithOptionalPermissions(roleName, actionIds);


  // Create the new admin user
  const newUser = new userModel({
    name,
    email,
    phone,
    nationality,
    password: hashedPassword,
    UserStatus: AccountStatusEnum.ACTIVE,
    role: RoleEnum.ADMIN,
    roleId : roleDoc?._id || null,
    forgotPasswordToken: null,
    forgotPasswordExpires: null
  });

  await newUser.save();

  let refreshToken = generateRefreshToken({
    id: String(newUser._id),
    role: newUser.role,
  });

  await userModel.findByIdAndUpdate(newUser._id, { refreshToken });

  res.status(201).json({
    message: "Admin user created successfully.",
    newUser ,
  });
};

// 3rd
  export const assignActionsToRole = async (req: Request, res: Response) => {
    const { roleId, actionIds } = req.body;
  
  
  };
  
  


// 4th
export const changeRole = async (req: Request, res: Response) => {
  const { userId, newRoleName } = req.body;

  
};

