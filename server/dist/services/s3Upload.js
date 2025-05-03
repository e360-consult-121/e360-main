"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImageFromS3 = exports.upload = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
exports.upload = (0, multer_1.default)({
    // You’re telling multer to use S3 as the storage destination instead of local storage.
    storage: (0, multer_s3_1.default)({
        s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const uniqueName = `${Date.now()}-${file.originalname}`;
            cb(null, uniqueName);
        },
    }),
});
/**
 * Function to delete an image from S3
 * @param {string} imageUrl
 * @returns {Promise<void>}
 */
const deleteImageFromS3 = async (imageUrl) => {
    try {
        const bucketName = process.env.AWS_S3_BUCKET_NAME;
        const bucketUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
        const key = decodeURIComponent(imageUrl.replace(bucketUrl, ""));
        // console.log(key)
        if (!key) {
            console.warn("S3 key not found in the image URL:", imageUrl);
            return;
        }
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
        });
        await s3.send(command);
        console.log(`Image deleted successfully: ${key}`);
    }
    catch (error) {
        console.error("Error deleting image from S3:", error);
        throw error;
    }
};
exports.deleteImageFromS3 = deleteImageFromS3;
