import mongoose, { Schema, Document , Types } from "mongoose";
import { AccountStatusEnum, RoleEnum } from "../types/enums/enums";


export interface IUser extends Document {
  name:string;
  email: string;
  phone: string;
  nationality : string;
  password: string;
  refreshToken: string;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date;
  UserStatus: AccountStatusEnum;
  role: RoleEnum;
  forgotPasswordToken: string | null;
  forgotPasswordExpires: Date | null;
  nanoUserId : string;
  roleId: Types.ObjectId;
}

const UserSchema: Schema = new Schema <IUser> ({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  nationality : {type: String},
  password: { type: String, required: true },
  UserStatus: {
    type: String,
    enum: Object.values(AccountStatusEnum),
    required: true,
    default: AccountStatusEnum.ACTIVE
  },
  refreshToken: { type: String },
  forgotPasswordToken: { type: String, default: null },
  forgotPasswordExpires: { type: Date },
  role: {
    type: String,
    enum: Object.values(RoleEnum),
    required: true
  } , 
  nanoUserId: {
    type: String,     //optional
    unique: true,
    // required: true,
  } , 
  roleId: { 
    type: Schema.Types.ObjectId,    //optional  (no need , only 1 entry in DB )
    ref: "Role", 
    required: true
  },
},
{
  timestamps: true
});


// Pre save hook 
UserSchema.pre("save", async function (next) {
  const user = this ;

  if (user.isNew) {
    let nanoUserId;
    let exists = true;

    do {
      // Using dynamic import for nanoid
      const { nanoid } = await import('nanoid');
      const shortId = nanoid(6).toUpperCase(); // e.g., A7C8X9
      const year = new Date().getFullYear();
      nanoUserId = `E360-L-${shortId}`;

      const existing = await UserModel.exists({ nanoUserId });
      exists = existing !== null;
    } while (exists);

    user.nanoUserId = nanoUserId;
  }

  next();
});

export const UserModel = mongoose.model<IUser>("User", UserSchema);



