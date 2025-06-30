import mongoose, { Schema, Document, Types } from "mongoose";
import { logTypeEnum } from "../../types/enums/enums";

export interface ILog extends Document {
  logMsg: string;
  doneBy: Types.ObjectId | null;
  logType: logTypeEnum; 
  leadId : Types.ObjectId | null;
  visaApplicationId : Types.ObjectId | null;
  taskId : Types.ObjectId | null;
}

const LogSchema = new Schema<ILog>({
  logMsg: { type : String , required : true},
  doneBy: { type : Schema.Types.ObjectId, ref: "User", default: null },
  logType: {
    type: String,
    required: true,
    enum: Object.values(logTypeEnum),
  },
  leadId: { type : Schema.Types.ObjectId, ref: "Lead", default: null },
  visaApplicationId: { type : Schema.Types.ObjectId, ref: "VisaApplication", default: null },
  taskId: { type : Schema.Types.ObjectId, ref: "VisaApplication", default: null },
},
 {
    timestamps: true 
  });

export const LogModel = mongoose.model<ILog>("Log", LogSchema);


