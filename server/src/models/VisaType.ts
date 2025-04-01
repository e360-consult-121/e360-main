import mongoose, { Schema } from "mongoose";
import { VisaTypeEnum } from "../types/enums/enums";

interface IStep {
    stepName: string;
    stepNumber: number;
    requirements: Schema.Types.ObjectId[];
}

interface IVisaType extends Document {
    visaType: VisaTypeEnum
    steps: IStep[];
}

const VisaTypeSchema = new Schema<IVisaType>({
    visaType: {
        type: String,
        enum: Object.values(VisaTypeEnum),
        required: true
    },
    steps: [
        {
            
            stepName: {
                type: String,
                required: true
            },
            stepNumber: {
                type: Number,
                required: true
            },
            requirements: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Requirement",
                },
            ],
        },
    ],
}, {
    timestamps: true
});

export const VisaTypeModel = mongoose.model<IVisaType>("VisaType", VisaTypeSchema);
