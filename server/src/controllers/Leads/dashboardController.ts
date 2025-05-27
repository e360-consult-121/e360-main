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
      .limit(5)
      .populate({
        path: 'caseId',
        select: 'leadId nanoVisaApplicationId', // only fetch leadId from VisaApplication
      });

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
      $match: {
        status: "SCHEDULED",
        startTime: { $gte: new Date() }
      }
    },
    {
      $sort: {
        startTime: -1 
      }
    },
    {
      $limit: 5
    }
  ]);

  res.status(200).json({ consultations });
}

// returns last 30 Days leads ,%conversions ,pending and completed.  
export const fetchAnalytics =  async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfRange = new Date();
    startOfRange.setDate(startOfRange.getDate() - 30);

    const leadsLast30Days = await LeadModel.find({
      createdAt: { $gte: startOfRange }
    });

    const totalLeads = leadsLast30Days.length;

    const completedApplications = leadsLast30Days.filter(
      (lead) => lead.leadStatus === "PAYMENTDONE"
    ).length;

    const pendingApplications = leadsLast30Days.filter(
      (lead) => lead.leadStatus !== "PAYMENTDONE" && lead.leadStatus !== "REJECTED"
    ).length;

    const leadConversionRate = totalLeads === 0
      ? 0
      : Math.round((completedApplications / totalLeads) * 100);

    res.status(200).json({
      newLeadsLast30Days: totalLeads,
      leadConversionRate: `${leadConversionRate}%`,
      pendingApplications,
      completedApplications
    });

  } catch (error) {
    console.error("Error fetching lead stats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


