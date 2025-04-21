import { Schema, model } from "mongoose";

export interface RecentUpdatesTypes {
  caseId:string;
  name:string;
  status:string;
}

const recentUpdatesSchema = new Schema<RecentUpdatesTypes>(
  {
    caseId:{
        type: String,
        required: true,
    },
    name: {
        type: String,
        required : true ,
    },
    status: {
      type: String,
      required : true,
    }
  },
  { timestamps: true }
);

export const RecentUpdatesModel = model<RecentUpdatesTypes>(
  "RecentUpdates",
  recentUpdatesSchema
);