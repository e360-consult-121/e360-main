import { Request, Response } from "express";
import { VisaTypeModel } from "../../models/VisaType";
import { VisaApplicationModel } from "../../models/VisaApplication";


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
        .populate('userId')        
        .populate('visaTypeId');  
  
      return res.status(200).json({visaApplications:applications});
    } catch (error) {
      console.error('Error fetching visa applications:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  