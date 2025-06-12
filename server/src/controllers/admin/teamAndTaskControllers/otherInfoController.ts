import { Request, Response } from "express";
import mongoose, { Schema, Document, Types } from "mongoose";
import AppError from "../../../utils/appError";
import { TaskModel } from "../../../models/teamAndTaskModels/taskModel";
import { AssignmentModel } from "../../../models/teamAndTaskModels/assignModel";
import { taskPriorityEnum , taskStatusEnum } from "../../../types/enums/enums";
import { LeadModel } from "../../../leadModels/leadModel";
import { VisaApplicationModel } from "../../../models/VisaApplication";
import { UserModel } from "../../../models/Users";
import { ConsultationModel } from "../../../leadModels/consultationModel";

export const getAllLeads = async (req: Request, res: Response) => {

    const leads = await LeadModel.find();
    res.status(200).json({ leads });
  
  };
  
  export const getAllVisaApplications = async (req: Request, res: Response) => {
  
    const visaApplications = await VisaApplicationModel.find();
    res.status(200).json({ visaApplications });
  
  };


export const getAssigneeList = async (req: Request, res: Response): Promise<Response> => {
    const adminId = req.admin?.id;
    if (!adminId) {
      throw new AppError("Admin not authenticated", 401);
    }
  
    const assignees = await UserModel.aggregate([
      {
        $match: {
          role: "ADMIN",
        },
      },
      {
        $lookup: {
          from: "Roles", 
          localField: "roleId",
          foreignField: "_id",
          as: "roleDetails",
        },
      },
      {
        $unwind: {
          path: "$roleDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          role: 1,
          employeeId: 1, 
          roleName: "$roleDetails.roleName",
          isSelf: { $eq: ["$_id", new mongoose.Types.ObjectId(adminId)] }, 
        },
      },
    ]);
  
    return res.status(200).json({
      success: true,
      message: "Assignee list (including self) fetched successfully",
      data: assignees,
    });
  };


  export const addRemark = async (req: Request, res: Response) => {

    const { taskId } = req.params;

    const  doneBy  = req.admin?.id;

    const { remarkMsg } = req.body;
  
    if (!taskId || !remarkMsg || !doneBy) {
      return res.status(400).json({ message: 'taskId, remarkMsg, and doneBy are required' });
    }
  
    if (!mongoose.Types.ObjectId.isValid(taskId) || !mongoose.Types.ObjectId.isValid(doneBy)) {
      return res.status(400).json({ message: 'Invalid taskId or doneBy format' });
    }
  
    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
  
    task.remarks.push({
      remarkMsg,
      doneBy: new mongoose.Types.ObjectId(doneBy),
    });
  
    await task.save();
  
    // Return success response
    return res.status(200).json({
      message: 'Remark added successfully',
      task,
    });
  };