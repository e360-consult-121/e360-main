import mongoose, { Schema, Document } from "mongoose";
import { AccountStatusEnum, RoleEnum } from "../types/enums/enums";


export interface IUser extends Document {
  email: string;
  password: string;
  refreshToken: string;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date;
  status: AccountStatusEnum;
  role: RoleEnum;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  // phone number -->> needed honge jab admin side running applications show karenge 
  password: {
    type: String,
    required: true
  },
  UserStatus: {
    type: String,
    enum: Object.values(AccountStatusEnum),
    required: true,
    default: AccountStatusEnum.ACTIVE
  },
  refreshToken: {
    type: String,
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date
  },
  role: {
    type: String,
    enum: Object.values(RoleEnum),
    required: true,
  }
},
  {
    timestamps: true
  }
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);


// payment model needed hoga , jab session-id and all DB me save karwani hogi 

// reschedulig model , may be medical rescheduling wala part isse handle kar sake (May be or not)
