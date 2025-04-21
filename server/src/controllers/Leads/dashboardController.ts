import { ConsultationModel } from "../../leadModels/consultationModel";
import { LeadModel } from "../../leadModels/leadModel";
import { RecentUpdatesModel } from "../../leadModels/recentUpdatesModel";
import { RevenueModel } from "../../leadModels/revenueModel"
import { Request, Response } from "express";



// Fetch all visaType Revenue
export const getAllRevenue = async(req: Request, res: Response)=>{
    const revenue = await RevenueModel.find()

    res.status(200).json({ revenue });
}


// Fetch 5 recent updates from RecentUpdatesDB
export const getRecentUpdates = async (req: Request, res: Response) => {
    try {
      const recentUpdates = await RecentUpdatesModel.find()
        .sort({ createdAt: -1 })  
        .limit(5);
  
      res.status(200).json({ updates: recentUpdates });
    } catch (error) {
      console.error("Error fetching recent updates:", error);
      res.status(500).json({ message: "Error fetching recent updates" });
    }
  };

// Fetch 5 recent leads 
export const fetchRecentLeads = async(req: Request, res: Response) => {
   const leads = await LeadModel.find().sort({createdAt : -1}).limit(5);
   res.status(200).json({ leads });
}

//Fetch 5 recent consultations
export const fetchRecentConsultions = async(req: Request, res: Response) => {
  const consultations = await ConsultationModel.aggregate([
    {
      $addFields: {
        statusOrder: {
          $switch: {
            branches: [
              { case: { $eq: ["$status", "SCHEDULED"] }, then: 0 },
              { case: { $eq: ["$status", "CANCELLED"] }, then: 1 },
              { case: { $eq: ["$status", "COMPLETED"] }, then: 2 },
            ],
            default: 3
          }
        }
      }
    },
    {
      $sort: {
        statusOrder: 1,
        startTime: 1
      }
    },
    {
      $project: {
        statusOrder: 0
      }
    }
  ]).limit(5)

  res.status(200).json({ consultations });
}

