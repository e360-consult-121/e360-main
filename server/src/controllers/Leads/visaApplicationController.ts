import { Request, Response } from "express";
import { VisaTypeModel } from "../../models/VisaType";
import { VisaApplicationModel } from "../../models/VisaApplication";
import { VisaStepModel } from "../../models/VisaStep";
import mongoose, { Schema, Document , Types } from "mongoose";


export const fetchAllStepsOfParticularVisaType = async (req: Request, res: Response) =>{
  
  const { visaType } = req.query;
  
  if (!visaType) {
    return res.status(400).json({ error: 'visaType query parameter is required' });
  }
    const visaTypeDoc = await VisaTypeModel.findOne({ visaType });

    if (!visaTypeDoc) {
      return res.status(404).json({ error: 'Visa type not found' });
    }
    
    try {
      const visaTypeId =  visaTypeDoc._id
      const allSteps = await VisaStepModel.find({ visaTypeId }).sort({ stepNumber: 1 });
      const stepNames = allSteps.map((step) => step.stepName);
      return res.status(200).json({stepNames});
    } 
    catch (error) {
      console.error('Error fetching visa applications:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }

}

// API for fetching all apllications of a particular type 
export const fetchParticularVisaApplication = async (req: Request, res: Response) => {
    const { visaType } = req.query;
  
    if (!visaType) {
      return res.status(400).json({ error: 'visaType query parameter is required' });
    }
  
    try {
      const visaTypeDoc = await VisaTypeModel.findOne({ visaType });
  
      if (!visaTypeDoc) {
        return res.status(404).json({ error: 'Visa type not found' });
      }
  
      const applications = await VisaApplicationModel.find({ visaTypeId: visaTypeDoc._id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'leadId',
        select: '_id caseId fullName email phone', 
      });  
      // .populate({
      //   path: 'visaTypeId',
      //   select: 'visaType country',
      // })
        // .populate('userId')
  
      return res.status(200).json({visaApplications:applications});
    } catch (error) {
      console.error('Error fetching visa applications:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };




// get info of particular visaApplication 
export const getParticularVisaInfo = async (req: Request, res: Response) => {
  const { visaApplicationId } = req.params;

  if (!visaApplicationId) {
    return res.status(400).json({ message: "visaApplicationId is required" });
  }

  const visaData = await VisaApplicationModel.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(visaApplicationId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $lookup: {
        from: "payments",
        localField: "paymentId",
        foreignField: "_id",
        as: "payment",
      },
    },
    {
      $unwind: {
        path: "$payment",
        preserveNullAndEmptyArrays: true, 
      },
    },
    {
      $lookup: {
        from: "visatypes", 
        localField: "visaTypeId",
        foreignField: "_id",
        as: "visaType",
      },
    },
    {
      $unwind: {
        path: "$visaType",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        nanoVisaApplicationId : 1,
        createdAt: 1,
        "user.name": 1,
        "user.email": 1,
        "user.phone": 1,
        "payment.status": 1,
        "payment.paymentMethod": 1,
        "payment.invoiceUrl": 1,
        "visaType.visaType": 1, 
      },
    },
  ]);

  if (!visaData || visaData.length === 0) {
    return res.status(404).json({ message: "Visa application not found" });
  }

  const data = visaData[0];

  const response = {
    basicInfo: {
      name: data.user.name,
      email: data.user.email,
      phone: data.user.phone,
      appliedFor: data.visaType?.visaType || "N/A",
      createdAt: data.createdAt,
      caseId: data.nanoVisaApplicationId, // You can change to `nanoLeadId` if it exists
    },
    paymentInfo: data.payment
      ? {
          status: data.payment.status,
          method: data.payment.paymentMethod, 
          invoice: data.payment.invoiceUrl,
        }
      : null,
  };

  res.status(200).json({ success: true, data: response });
};
  