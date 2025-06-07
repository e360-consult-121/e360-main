import { Request, Response, NextFunction } from "express";
import mongoose, { Schema, Document, Types } from "mongoose";
import { ActionModel } from "../models/rbacModels/actionModel";
import { PermissionModel } from "../models/rbacModels/permissionModel";

export const checkPermission = (actionName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    
    const roleId = req.user?.roleId || req.admin?.roleId;

    if (!roleId) {
      return res.status(401).json({ message: "User role not found in permission middleware" });
    }

    const action = await ActionModel.findOne({ action: actionName });
    if (!action) {
      return res.status(404).json({ message: "Action not found" });
    }

    const permission = await PermissionModel.findOne({
      roleId : new Types.ObjectId(roleId) ,
      actionId: action._id,
    });

    if (!permission) {
      return res.status(403).json({ message: "Access Denied" });
    }

    next();
  };
};
