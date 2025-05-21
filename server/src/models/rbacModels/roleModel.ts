import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRole extends Document {
  name: string; 
}

const RoleSchema = new Schema<IRole>({
  name: { type: String, required: true, unique: true },
});

export const RoleModel = mongoose.model<IRole>("Role", RoleSchema);
