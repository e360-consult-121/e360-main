import mongoose, { Schema } from "mongoose";
import { VisaTypeEnum } from "../types/enums/enums";

// export interface IRequirement {
//     type: QuestionTypeEnum,
//     question: string;
//     options: string[];
//     required: boolean;
//     source: DocumentSourceEnum
// };

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
            //             required: true
            //         }
            //     },
            // ],
        },
    ],
}, {
    timestamps: true
});

export const VisaType = mongoose.model<IVisaType>("VisaType", VisaTypeSchema);
