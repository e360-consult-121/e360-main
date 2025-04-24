import { NextFunction, Request, Response } from "express";
import AppError from "../../utils/appError";
import {VisaApplicationStepStatusModel as stepStatusModel} from "../../models/VisaApplicationStepStatus";
import { StepStatusEnum  , dgInvestStatusEnum ,investmentOptionEnum} from "../../types/enums/enums"
import {DgInvestmentModel } from "../../extraModels/dgInvestment";



export const selectOption = async (req: Request, res: Response) => {
    const { stepStatusId } = req.params;
    const { investmentOption } = req.body;
  
    if (!investmentOption) {
      res.status(400).json({ message: "investmentOption is required" });
      return;
    }
  
    if (!Object.values(investmentOptionEnum).includes(investmentOption)) {
      res.status(400).json({ message: `Invalid investmentOption. Allowed values: ${Object.values(investmentOptionEnum).join(", ")}` });
      return;
    }
  
    const newInvestment = await DgInvestmentModel.create({
      stepStatusId,
      investmentOption,
      dgInvestStatus: dgInvestStatusEnum.optionSelected,
    });
  
    res.status(201).json({
      message: "Investment option selected successfully",
      data: newInvestment,
    });  
   
};




export const addOptionsForRealState = async (req: Request, res: Response) => {
    const { stepStatusId } = req.params;
    const { realStateOptions } = req.body;
  
    if (!Array.isArray(realStateOptions)) {
      res.status(400).json({ message: "realStateOptions must be an array" });
      return;
    }
  
    const updatedInvestment = await DgInvestmentModel.findOneAndUpdate(
      { stepStatusId },
      {
        realStateOptions,
        dgInvestStatus: dgInvestStatusEnum.realStateOptionsUploaded,
      },
      { new: true }
    );
  
    if (!updatedInvestment) {
      res.status(404).json({ message: "Investment not found for given stepStatusId" });
      return;
    }
  
    res.status(200).json({
      message: "Real state options added successfully",
      data: updatedInvestment,
    });
  };




export const uploadInvoice = async (req: Request, res: Response) => {
    const { stepStatusId } = req.params;

    if (!req.file) {
      res.status(400).json({ message: "No invoice file uploaded" });
      return;
    }
    const file = req.file;
    // Use `location` if using S3, otherwise fallback to `path`
    const invoiceUrl = (file as any).location;
  
    const updatedInvestment = await DgInvestmentModel.findOneAndUpdate(
      { stepStatusId },
      { invoiceUrl },
      { new: true }
    );
  
    if (!updatedInvestment) {
      res.status(404).json({ message: "Investment not found for given stepStatusId" });
      return;
    }
  
    res.status(200).json({
      message: "Invoice uploaded successfully",
      data: updatedInvestment,
    });
  };
  












  
  
  