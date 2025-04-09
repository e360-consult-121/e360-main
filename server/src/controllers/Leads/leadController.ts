import { NextFunction, Request, Response } from "express";
import AppError from "../../utils/appError";
import { UserModel } from "../../models/Users";
import { LeadModel } from "../../leadModels/leadModel";
import { RoleEnum } from "../../types/enums/enums";



export const getAllLeads = async (req: Request, res: Response) => {
    const leads = await LeadModel.find();
    res.status(200).json({ leads });
  };






