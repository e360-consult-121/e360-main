import { NextFunction, Request, Response } from "express";
import AppError from "../../utils/appError";
import {  aimaStatusEnum } from "../../types/enums/enums"
import { aimaModel} from "../../extraModels/aimaModel";



export const updateStatus = async (req: Request, res: Response) => {
    const { aimaId } = req.params;
    const { aimaNumber } = req.body;
  
    const updatePayload: any = {
      isCompleted: true,
      completedOn: Date.now(),
    };
  
    // Only set aimaNumber if it's a non-empty string
    if (aimaNumber && aimaNumber.trim() !== "") {
      updatePayload.aimaNumber = aimaNumber;
    }
  
    const updatedDoc = await aimaModel.findByIdAndUpdate(aimaId, updatePayload, {
      new: true,
    });
  
    if (!updatedDoc) {
      res.status(404);
      throw new Error("AIMA document not found");
    }
  
    res.status(200).json({
      message: "AIMA step marked as completed",
      data: updatedDoc,
    });
};

// "2025-02-12T12:30:00.000Z"
// const isoDate = new Date(Date.now()).toISOString(); 
// {
//     "completedOn": "2025-02-12T12:30:00.000Z"
//  }

// when aimaNumber not present send -->> ""





  












  
  
  