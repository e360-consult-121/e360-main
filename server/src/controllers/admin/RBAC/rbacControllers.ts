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
  const existingRole = await roleModel.findOne({ roleName: roleName });

  if (existingRole) {
    return { role: existingRole, alreadyExisted: true };
  }

  // Create new role
  const newRole = await roleModel.create({ roleName: roleName });

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

  if (!name || typeof name !== 'string') {
    res.status(400);
    throw new Error('Role name is required and must be a string.');
  }

  if (!Array.isArray(actionIds) || actionIds.some(id => typeof id !== 'string')) {
    res.status(400);
    throw new Error('actionIds must be an array of strings.');
  }

  // Check for existing role
  const existingRole = await roleModel.findOne({ name });
  if (existingRole) {
    res.status(409);
    throw new Error('Role already exists.');
  }

  // Create new role
  const newRole = await roleModel.create({ name });

  // Create permission for each actionId
  const permissions = actionIds.map(actionId => ({
    roleId: newRole._id,
    actionId,
  }));

  await permissionModel.insertMany(permissions);

  res.status(201).json({
    message: 'Role and permissions created successfully.',
    role: newRole,
    permissionsCreated: permissions.length,
  });
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

  if (!roleId || !Array.isArray(actionIds)) {
    res.status(400);
    throw new Error("roleId and actionIds array are required");
  }

  if (actionIds.length === 0) {
    res.status(400);
    throw new Error("actionIds array cannot be empty");
  }

  // Check if role exists
  const role = await roleModel.findById(roleId);
  if (!role) {
    res.status(404);
    throw new Error("Role not found");
  }

  // Validate all actionIds exist
  const validActions = await actionModel.find({ _id: { $in: actionIds } });
  const validActionIds = validActions.map(action => String(action._id));

  if (validActionIds.length !== actionIds.length) {
    res.status(400);
    throw new Error("One or more actionIds are invalid");
  }

  // Filter out already existing permissions
  const existingPermissions = await permissionModel.find({
    roleId,
    actionId: { $in: validActionIds },
  });

  // existingId's pata kar lo (vakid Id's me se filter kar lenge )
  const existingActionIds = new Set(existingPermissions.map(p => String(p.actionId)));

  const newPermissionsData = validActionIds
    .filter(id => !existingActionIds.has(id))
    .map(actionId => ({
      roleId,
      actionId,
    }));

  // Insert only the new (non-duplicate) permissions
  const insertedPermissions = await permissionModel.insertMany(newPermissionsData);

  res.status(201).json({
    success: true,
    message: `${insertedPermissions.length} permission(s) assigned to role.`,
    permissions: insertedPermissions,
    skipped: validActionIds.length - insertedPermissions.length,
  });
};
  
  


// 4th
export const changeRole = async (req: Request, res: Response) => {
  const { userId, newRoleName } = req.body;

  // Input validation
  if (!userId || !newRoleName) {
    res.status(400);
    throw new Error("userId and newRoleName are required.");
  }

  // Find user by ID
  const user = await userModel.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  // Find role by name
  const role = await roleModel.findOne({ name: newRoleName });
  if (!role) {
    res.status(404);
    throw new Error("Specified role does not exist.");
  }

  // Update user's roleId
  user.roleId = role._id as Types.ObjectId;;
  await user.save();

  res.status(200).json({
    success: true,
    message: "User role updated successfully.",
    user,
  });
};

