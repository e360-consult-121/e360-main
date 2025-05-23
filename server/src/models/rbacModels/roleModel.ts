import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRole extends Document {
  roleName: string; 
}

const RoleSchema = new Schema<IRole>({
  roleName: { type: String, required: true, unique: true },
});

export const RoleModel = mongoose.model<IRole>("Role", RoleSchema);
