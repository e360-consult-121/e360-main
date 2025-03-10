import mongoose, { Schema } from "mongoose";
import { StepStatusEnum } from "../types/enums/enums";
import { IRequirementStatus } from "./RequirementStatus";


interface IStepStatus {
    stepNumber: number,
    stepName: string,
    status: StepStatusEnum,
    unlockedAt: Date,
    requirements: IRequirementStatus[]
}

interface IStepTracking extends Document {
    visaApplicationId: Schema.Types.ObjectId,
    stepStatus: IStepStatus[]
}

const stepTracking = new mongoose.Schema({
    visaApplicationId: {
        type: Schema.Types.ObjectId,
        ref: "VisaApplication",
        required: true,
    },
    stepStatus: [
        {
            stepNumber: {
                type: Number,
                required: true,
            },
            stepName: {
                type: String,
                required: true,
            },
            status: {
                type: String,
                enum: Object.values(StepStatusEnum),
                required: true,
            },
            unlockedAt: {
                type: Date,
                required: true,
            },
            requirements: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "RequirementStatus",
                },
            ],
            // requirements: [
            //     {
            //         type: {
            //             type: String,
            //             enum: Object.values(QuestionTypeEnum),
            //             required: true,
            //         },
            //         question: {
            //             type: String,
            //             required: true,
            //         },
            //         options: {
            //             type: [String],
            //             required: true,
            //         },
            //         required: {
            //             type: Boolean,
            //             required: true,
            //         },
            //         source: {
            //             type: String,
            //             enum: Object.values(DocumentSourceEnum),
            //             required: true,
            //         },
            //         status: {
            //             type: String,
            //             enum: Object.values(QuestionStatusEnum),
            //             required: true,
            //         },
            //         reason: {
            //             type: String,
            //             required: true,
            //         },
            //         value: {
            //             type: Schema.Types.Mixed,
            //             required: true,
            //         },
            //     },
            // ],
        },
    ],
});
export const StepTracking = mongoose.model<IStepTracking>("StepTracking", stepTracking)