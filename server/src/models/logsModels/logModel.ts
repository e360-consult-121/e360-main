import mongoose, { Schema, Document, Types } from "mongoose";
import { logTypeEnum } from "../../types/enums/enums";

export interface ILog extends Document {
  logMsg: string;
  doneBy: Types.ObjectId | null;
  logType: logTypeEnum; 
}

const LogSchema = new Schema<ILog>({
  logMsg: { type : String , required : true},
  doneBy: { type : Schema.Types.ObjectId, ref: "User", default: null },
  logType: {
    type: String,
    required: true,
    enum: Object.values(logTypeEnum),
  },
},
 {
    timestamps: true 
  });

export const LogModel = mongoose.model<ILog>("Log", LogSchema);

// DO we need to store visaApplicationId 