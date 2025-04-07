import mongoose, { Schema, Document } from "mongoose";
import { VisaApplicationStatusEnum } from "../types/enums/enums";


export interface IVisaApplication extends Document {
    userId: mongoose.Schema.Types.ObjectId; 
    visaTypeId: mongoose.Schema.Types.ObjectId; 
    currentStep: number; 
    visaApplicationStatus: VisaApplicationStatusEnum;
}


const VisaApplicationSchema = new Schema<IVisaApplication>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User", 
            required: true
        },
        visaTypeId: {
            type: Schema.Types.ObjectId,
            ref: "VisaType", 
            required: true
        },
        currentStep: {
            type: Number,
            required: true
        },
        visaApplicationStatus: {
            type: String,
            enum: Object.values(VisaApplicationStatusEnum),
            default: VisaApplicationStatusEnum.PENDING,
        }
    },
    { timestamps: true }
);


export const VisaApplicationModel = mongoose.model<IVisaApplication>(
    "VisaApplication",
    VisaApplicationSchema
);
