import { NextFunction, Request, Response } from "express";
import mongoose, { Schema, Document } from "mongoose";
import AppError from "../../../utils/appError";
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


// fetchAllFeatures 
export const fetchAllFeatures = async (req: Request, res: Response) => {
    const featuresWithActions = await featureModel.aggregate([
      {
        $lookup: {
          from: "actions", // collection name in MongoDB (must be lowercase plural of the model name)
          localField: "_id",
          foreignField: "featureId",
          as: "actions",
        },
      },
      {
        $sort: { name: 1 }, // sort by feature name
      },
      {
        $project: {
          _id: 1,
          name: 1,
          code: 1,
          actions: {
            _id: 1,
            action: 1,
            description: 1,
          },
        },
      },
    ]);
  
    res.status(200).json({
      success: true,
      count: featuresWithActions.length,
      features: featuresWithActions,
    });
  };


// ftechAllAdminUsers
export const fetchAllAdminUsers = async (req: Request, res: Response) => {
    const adminUsers = await userModel.find({ role: RoleEnum.ADMIN })
      .populate<{ roleId: { _id: string; name: string } }>("roleId", "name") // safe populate with type
      .select("-password -refreshToken -forgotPasswordToken -forgotPasswordExpires")
      .sort({ createdAt: -1 });
  
    res.status(200).json({
      success: true,
      count: adminUsers.length,
      users: adminUsers,
    });
};


export const fetchAllRoles = async (req: Request, res: Response) => {
    const roles = await roleModel.find().sort({ name: 1 }); // sorted alphabetically
  
    res.status(200).json({
      success: true,
      count: roles.length,
      roles,
    });
};

export const assignPermission = async (req: Request, res: Response) => {
    const { roleId, actionId } = req.body;
  
    if (!roleId || !actionId) {
      res.status(400);
      throw new Error("Both roleId and actionId are required.");
    }
  
    // Parallel existence checks
    const [role, action] = await Promise.all([
      roleModel.findById(roleId),
      actionModel.findById(actionId),
    ]);
  
    if (!role) {
      res.status(404);
      throw new Error("Role not found.");
    }
  
    if (!action) {
      res.status(404);
      throw new Error("Action not found.");
    }
  
    // Check for duplicate permission
    const existingPermission = await permissionModel.findOne({ roleId, actionId });
    if (existingPermission) {
      res.status(400);
      throw new Error("Permission already assigned to this role.");
    }
  
    // Create new permission
    const newPermission = await permissionModel.create({ roleId, actionId });
  
    res.status(201).json({
      success: true,
      message: "Permission assigned successfully.",
      permission: newPermission,
    });
  };
  
  
  export const revokePermission = async (req: Request, res: Response) => {
    const { roleId, actionId } = req.body;
  
    // Input validation
    if (!roleId || !actionId) {
      res.status(400);
      throw new Error("Both roleId and actionId are required.");
    }
  
    // Parallel existence checks
    const [role, action] = await Promise.all([
      roleModel.findById(roleId),
      actionModel.findById(actionId),
    ]);
  
    if (!role) {
      res.status(404);
      throw new Error("Role not found.");
    }
  
    if (!action) {
      res.status(404);
      throw new Error("Action not found.");
    }
  
    // Check if permission exists
    const permission = await permissionModel.findOne({ roleId, actionId });
    if (!permission) {
      res.status(404);
      throw new Error("Permission not found for this role and action.");
    }
  
    // Delete the permission
    await permissionModel.deleteOne({ _id: permission._id });
  
    res.status(200).json({
      success: true,
      message: "Permission revoked successfully.",
    });
  };
  