import { Request, Response } from "express";
import { LogModel } from "../../models/logsModels/logModel";


export const fetchAllLogs = async (req: Request, res: Response) => {
    const logs = await LogModel.find()
      .populate("doneBy", "name email") // populate user info if needed
      .sort({ createdAt: -1 }); // latest first
  
    res.status(200).json({
      success: true,
      message: "Logs fetched successfully",
      data: logs,
    });
  };

export const editBankDetails = async(req: Request, res: Response)=>{

    
}