import mongoose, { Schema, Document } from "mongoose";
import { DocumentSourceEnum , StepTypeEnum } from "../types/enums/enums";

export interface IVisaStep extends Document {
    stepName: string;
    stepNumber: number;
    stepSource: DocumentSourceEnum;
    stepType: StepTypeEnum;
    visaTypeId: mongoose.Schema.Types.ObjectId; 
}


const VisaStepSchema = new Schema<IVisaStep>(
    {
        visaTypeId: {
            type: Schema.Types.ObjectId,
            ref: "VisaType", 
            required: true
        },
        stepName: {
            type: String,
            required: true
        },
        stepNumber: {
            type: Number,
            required: true
        },
        stepSource: {
            type: String,
            enum: Object.values(DocumentSourceEnum),
            required: true
        },
        stepType: {
            type: String,
            enum: Object.values(StepTypeEnum),
            required: true
        },
        
    },
    { timestamps: true }
);


export const VisaStepModel = mongoose.model<IVisaStep>("VisaStep", VisaStepSchema);
