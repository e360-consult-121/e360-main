import { Request, Response } from "express";
import { VisaTypeModel } from "../../models/VisaType";
import { VisaApplicationModel } from "../../models/VisaApplication";
import { VisaStepModel } from "../../models/VisaStep";



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
  