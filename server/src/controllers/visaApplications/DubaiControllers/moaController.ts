import { NextFunction, Request, Response } from "express";
import AppError from "../../../utils/appError";
import { moaModel } from "../../../extraModels/MOA_Model";
import { moaStatusEnum } from "../../../types/enums/enums";
import mongoose, { Types } from "mongoose";

// For Admin
export const moaUpload = async (req: Request, res: Response) => {
  const { stepStatusId } = req.params;
  const file = req.file;

  if (!stepStatusId || !file) {
    throw new AppError("stepStatusId and file are required.", 400);
  }

  const newMOA = await moaModel.create({
    moaDocument: (file as any).location, // S3 URL
    status: moaStatusEnum.MOA_Uploaded,
    stepStatusId,
  });

  res.status(201).json({
    message: "MOA document uploaded and MOA record created.",
    moaStatus: newMOA.status,
  });
};

// For User
export const moaDocumentFetch = async (req: Request, res: Response) => {
  const { stepStatusId } = req.params;

  if (!stepStatusId) {
    throw new AppError("stepStatusId is required in params.", 400);
  }

  const moa = await moaModel.findOne({ stepStatusId });

  if (!moa) {
    throw new AppError("MOA not found for the given stepStatusId.", 404);
  }

  res.status(200).json({
    message: "MOA document fetched successfully.",
    moaDocument: moa.moaDocument,
    moaStatus: moa.status,
  });
};

// For User
export const uploadSignature = async (req: Request, res: Response) => {
  const { stepStatusId } = req.params;
  const file = req.file;

  if (!stepStatusId || !file) {
    throw new AppError("stepStatusId and signature file are required.", 400);
  }

  const moa = await moaModel.findOne({ stepStatusId });

  if (!moa) {
    throw new AppError("MOA not found for the given stepStatusId.", 404);
  }

  (moa.signatureFile = (file as any).location),
    (moa.status = moaStatusEnum.Sig_Uploaded);
  await moa.save();

  res.status(200).json({
    message: "Signature uploaded successfully.",
    signatureFile: moa.signatureFile,
    moaStatus: moa.status,
  });
};

// For common
export const fetchSigAndMOA = async (req: Request, res: Response) => {
  const { stepStatusId } = req.params;

  if (!stepStatusId) {
    throw new AppError("stepStatusId is required in params.", 400);
  }

  const moa = await moaModel.findOne({ stepStatusId });

  if (!moa) {
    return res.status(200).json({
      message: "MOA not uploaded yet",
      data: null,
    });
  }

  res.status(200).json({
    message: "MOA and Signature fetched successfully.",
    data: {
      moaDocument: moa.moaDocument,
      signatureFile: moa.signatureFile, 
      moaStatus: moa.status,
    },
  });
};

// For Admin
export const approveSignature = async (req: Request, res: Response) => {
  const { stepStatusId } = req.body;

  if (!stepStatusId) {
    throw new AppError("stepStatusId is required in body.", 400);
  }

  const moa = await moaModel.findOne({ stepStatusId });

  if (!moa) {
    throw new AppError("MOA not found for the given stepStatusId.", 404);
  }

  if (!moa.signatureFile) {
    throw new AppError("No signature uploaded to approve.", 400);
  }

  moa.status = moaStatusEnum.Sig_Approved;
  await moa.save();

  res.status(200).json({
    message: "Signature approved successfully.",
    moaStatus: moa.status,
  });
};
