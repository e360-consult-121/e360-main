import mongoose, { Schema } from "mongoose";
import { VisaApplicationStatusEnum, VisaTypeEnum } from "../types/enums/enums";

interface IVisaApplication {
    userId: Schema.Types.ObjectId,
    visaTypeId: Schema.Types.ObjectId
    status: VisaApplicationStatusEnum,
    currentStep: number,
};


const visaApplication = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    visaTypeId: {
        type: Schema.Types.ObjectId,
        ref: "VisaType",
        required: true
    },
    status: {
        type: String,
        enum: Object.values(VisaApplicationStatusEnum),
        default: VisaApplicationStatusEnum.PENDING
    },
    currentStep: {
        type: Number,
        default: 1,
        required: true
    }
},{
    timestamps:true
});

export const VisaApplicationModel = mongoose.model<IVisaApplication>("VisaApplication", visaApplication);

