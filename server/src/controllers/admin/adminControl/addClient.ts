import { NextFunction, Request, Response } from "express";
import mongoose, { Schema, Document } from "mongoose";
import AppError from "../../../utils/appError";
import { UserModel as userModel } from "../../../models/Users";
import bcrypt from "bcryptjs";
import {
  RoleEnum,
  AccountStatusEnum,
} from "../../../types/enums/enums";
import { sendPortalAccessToClient } from "../../../services/emails/triggers/leads/payment/payment-successful";
import {createVisaApplication} from "../../Leads/paymentFunctions";


const VISATYPE_MAP: Record<string, string> = {
  "Portugal": "6803644993e23a8417963622",
  "Dubai": "6803644993e23a8417963623",
  "Dominica": "6803644993e23a8417963620", 
  "Grenada": "6803644993e23a8417963621", 
};

export const addNewClient = async (req: Request, res: Response) => {
    
    const { name, email, phone ,nationality, serviceType } = req.body;
  
    // 1. Check if user already exists
    const existingUser = await userModel.findOne({ email });
    const visaTypeId = VISATYPE_MAP[serviceType];

    if (existingUser) {
        const { visaApplicantInfo } = await createVisaApplication({
          userId: (existingUser._id as mongoose.Types.ObjectId).toString(),
          visaTypeId,
        });

        return res.status(200).json({
          message: "User already exists. New visa application created.",
          newApplication : visaApplicantInfo,
        });
    }
  
    //  Generate random password
    const randomPassword = Math.random().toString(36).slice(-5); 
  
    //  Hash the password
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
  
    //  Create user in DB
    const user = await userModel.create({
      name,
      email,
      phone,
      nationality ,
      password: hashedPassword,
      role: RoleEnum.USER,
      status: AccountStatusEnum.ACTIVE,
    });
  
    // Send email with credentials
    await sendPortalAccessToClient(user.email, user.name,serviceType , randomPassword)

    // create new visaApplication 
    const { visaApplicantInfo } = await createVisaApplication({
      userId: (user._id as mongoose.Types.ObjectId).toString(),
      visaTypeId,
    });
  
    res.status(201).json({
      message: "Client added successfully and credentials sent via email and newApplication is also created.",
      newUser: user,
      newVisaApplication : visaApplicantInfo,
    });
};


