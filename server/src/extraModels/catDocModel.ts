import mongoose, { Schema, Document } from "mongoose";
import { DocumentSourceEnum } from "../types/enums/enums";

export interface ICategoryDocument extends Document {
    categoryId: mongoose.Schema.Types.ObjectId;
    url: string;
    name: string;
    uploadedBy: DocumentSourceEnum;
}

const CategoryDocumentSchema = new Schema<ICategoryDocument>(
    {
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        url: {
            type: String,
            required: true
        },
        name: {
            type: String
        },
        uploadedBy: {
            type: String,
            enum: Object.values(DocumentSourceEnum),
            required: true
        }
    },
    { timestamps: true }
);

export const CatDocModel = mongoose.model<ICategoryDocument>(
    "CategoryDocument",
    CategoryDocumentSchema
);
