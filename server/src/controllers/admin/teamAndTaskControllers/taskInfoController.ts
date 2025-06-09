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

// Fetch All Tasks
export const fetchAllTasks = async (req: Request, res: Response) => {
    const { sortBy = "dueDate", order = "asc" } = req.query;
  
    const sortFieldsMap: Record<string, string> = {
      priority: "priority",
      status: "status",
      dueDate: "endDate"
    };
  
    const sortField = sortFieldsMap[sortBy as string] || "endDate";
    const sortOrder = order === "desc" ? -1 : 1;
  
    const tasks = await TaskModel.aggregate([
      // Step 1: Join assignments
      {
        $lookup: {
          from: "assignments",
          localField: "_id",
          foreignField: "taskId",
          as: "assignments",
        },
      },
      // Step 2: Extract all assignedTo (users)
      {
        $lookup: {
          from: "users",
          localField: "assignments.memberId",
          foreignField: "_id",
          as: "assignedToUsers",
        },
      },
      // Step 3: Extract assignedBy (assuming same assignedBy for all )
      {
        $lookup: {
          from: "users",
          localField: "assignments.assignedBy",
          foreignField: "_id",
          as: "assignedByUsers",
        },
      },
      // Step 4: Project final structure
      {
        $project: {
          taskName: 1,
          status: 1,
          priority: 1,
          endDate: 1,
          dueDate: "$endDate",
          assignedCount: { $size: "$assignedToUsers" },
          assignedTo: {
            $map: {
              input: "$assignedToUsers",
              as: "user",
              in: {
                _id: "$$user._id",
                name: "$$user.name",
                email: "$$user.email"
              }
            }
          },
          assignedBy: {
            $cond: {
              if: { $gt: [{ $size: "$assignedByUsers" }, 0] },
              then: {
                _id: { $arrayElemAt: ["$assignedByUsers._id", 0] },
                name: { $arrayElemAt: ["$assignedByUsers.name", 0] },
                email: { $arrayElemAt: ["$assignedByUsers.email", 0] }
              },
              else: null
            }
          }
        }
      },
      // Step 5: Sort
      {
        $sort: {
          [sortField]: sortOrder
        }
      }
    ]);
  
    res.status(200).json({
      success: true,
      tasks,
    });
  };


//   Fetch My tasks 
export const fetchMyTasks = async (req: Request, res: Response): Promise<Response> => {

    const adminId = req.admin?.id;
    if (!adminId) {
      throw new AppError("Admin not authenticated", 401);
    }
  
    const tasks = await AssignmentModel.aggregate([
      {
        $match: {
          memberId: new mongoose.Types.ObjectId(adminId),
        },
      },
      {
        $lookup: {
          from: "tasks",
          localField: "taskId",
          foreignField: "_id",
          as: "taskDetails",
        },
      },
      { $unwind: "$taskDetails" },
  
      // Get all users assigned to the same task
      {
        $lookup: {
          from: "assignments",
          let: { currentTaskId: "$taskId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$taskId", "$$currentTaskId"] },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "memberId",
                foreignField: "_id",
                as: "memberDetails",
              },
            },
            { $unwind: "$memberDetails" },
            {
              $project: {
                userId: "$memberDetails._id",
                email: "$memberDetails.email",
                name : "$memberDetails.name"
              },
            },
          ],
          as: "assignedToUsers",
        },
      },
  
      // Get info of the one who assigned this task
      {
        $lookup: {
          from: "users",
          localField: "assignedBy",
          foreignField: "_id",
          as: "assignedByDetails",
        },
      },
      {
        $unwind: {
          path: "$assignedByDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
  
      {
        $project: {
          taskName: "$taskDetails.taskName",
          assignedBy: {
            userId: "$assignedByDetails._id",
            email: "$assignedByDetails.email",
            name : "$assignedByDetails.name"
          },
          assignedTo: "$assignedToUsers", // all users this task is assigned to
          status: "$taskDetails.status",
          priority: "$taskDetails.priority",
          dueDate: "$taskDetails.endDate",
        },
      },
    ]);
    
  
    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: tasks,
    });
  };


// Fetch Upcoming Taks -->> start date will start after now 
export const fetchUpcomingTasks = async (req: Request, res: Response) => {

  console.log(`these are assignedIds for Upcoming tasks :`, req.assignedIds );

  const now = new Date();
  const { sortBy = "startDate", order = "asc" } = req.query;

  const sortFieldsMap: Record<string, string> = {
    priority: "priority",
    status: "status",
    startDate: "startDate",
    dueDate: "endDate",
  };

  const sortField = sortFieldsMap[sortBy as string] || "startDate";
  const sortOrder = order === "desc" ? -1 : 1;

  const matchStage: any = {
    startDate: { $gt: now },
  };

  if (Array.isArray(req.assignedIds) && req.assignedIds.length > 0) {
    matchStage._id = { $in: req.assignedIds };
  }

  const tasks = await TaskModel.aggregate([
    { $match: matchStage },

    {
      $lookup: {
        from: "assignments",
        localField: "_id",
        foreignField: "taskId",
        as: "assignments",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignments.memberId",
        foreignField: "_id",
        as: "assignedToUsers",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignments.assignedBy",
        foreignField: "_id",
        as: "assignedByUsers",
      },
    },
    {
      $project: {
        taskName: 1,
        status: 1,
        priority: 1,
        endDate: 1,
        dueDate: "$endDate",
        assignedCount: { $size: "$assignedToUsers" },
        assignedTo: {
          $map: {
            input: "$assignedToUsers",
            as: "user",
            in: {
              _id: "$$user._id",
              name: "$$user.name",
              email: "$$user.email",
            },
          },
        },
        assignedBy: {
          $cond: {
            if: { $gt: [{ $size: "$assignedByUsers" }, 0] },
            then: {
              _id: { $arrayElemAt: ["$assignedByUsers._id", 0] },
              name: { $arrayElemAt: ["$assignedByUsers.name", 0] },
              email: { $arrayElemAt: ["$assignedByUsers.email", 0] },
            },
            else: null,
          },
        },
      },
    },
    {
      $sort: { [sortField]: sortOrder },
    },
  ]);

  return res.status(200).json({
    success: true,
    tasks,
  });
};

  



// Fetch Due Tasks  -->> Now is in b/w start and end 
export const fetchDueTasks = async (req: Request, res: Response) => {
  const now = new Date();
  const { sortBy = "startDate", order = "asc" } = req.query;

  const sortFieldsMap: Record<string, string> = {
    priority: "priority",
    status: "status",
    startDate: "startDate",
    dueDate: "endDate",
  };

  const sortField = sortFieldsMap[sortBy as string] || "startDate";
  const sortOrder = order === "desc" ? -1 : 1;

  const matchStage: any = {
    startDate: { $lte: now },
    endDate: { $gte: now },
  };

  if (Array.isArray(req.assignedIds) && req.assignedIds.length > 0) {
    matchStage._id = { $in: req.assignedIds };
  }

  const tasks = await TaskModel.aggregate([
    { $match: matchStage },

    {
      $lookup: {
        from: "assignments",
        localField: "_id",
        foreignField: "taskId",
        as: "assignments",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignments.memberId",
        foreignField: "_id",
        as: "assignedToUsers",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignments.assignedBy",
        foreignField: "_id",
        as: "assignedByUsers",
      },
    },
    {
      $project: {
        taskName: 1,
        status: 1,
        priority: 1,
        startDate: 1,
        dueDate: "$endDate",
        assignedCount: { $size: "$assignedToUsers" },
        assignedTo: {
          $map: {
            input: "$assignedToUsers",
            as: "user",
            in: {
              _id: "$$user._id",
              name: "$$user.name",
              email: "$$user.email",
            },
          },
        },
        assignedBy: {
          $cond: {
            if: { $gt: [{ $size: "$assignedByUsers" }, 0] },
            then: {
              _id: { $arrayElemAt: ["$assignedByUsers._id", 0] },
              name: { $arrayElemAt: ["$assignedByUsers.name", 0] },
              email: { $arrayElemAt: ["$assignedByUsers.email", 0] },
            },
            else: null,
          },
        },
      },
    },
    {
      $sort: {
        [sortField]: sortOrder,
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    tasks,
  });
};





// Fetch OverDue TaskS -->> Jinki EndDate bhi nikal chuki hai 
export const fetchOverdueTasks = async (req: Request, res: Response) => {
  const now = new Date();
  const { sortBy = "endDate", order = "asc" } = req.query;

  const sortFieldsMap: Record<string, string> = {
    priority: "priority",
    status: "status",
    startDate: "startDate",
    dueDate: "endDate",
  };

  const sortField = sortFieldsMap[sortBy as string] || "endDate";
  const sortOrder = order === "desc" ? -1 : 1;

  const matchStage: any = {
    endDate: { $lt: now },  
  };

  if (Array.isArray(req.assignedIds) && req.assignedIds.length > 0) {
    matchStage._id = { $in: req.assignedIds };
  }

  const tasks = await TaskModel.aggregate([
    { $match: matchStage },

    {
      $lookup: {
        from: "assignments",
        localField: "_id",
        foreignField: "taskId",
        as: "assignments",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignments.memberId",
        foreignField: "_id",
        as: "assignedToUsers",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignments.assignedBy",
        foreignField: "_id",
        as: "assignedByUsers",
      },
    },
    {
      $project: {
        taskName: 1,
        status: 1,
        priority: 1,
        endDate: 1,
        dueDate: "$endDate",
        assignedCount: { $size: "$assignedToUsers" },
        assignedTo: {
          $map: {
            input: "$assignedToUsers",
            as: "user",
            in: {
              _id: "$$user._id",
              name: "$$user.name",
              email: "$$user.email",
            },
          },
        },
        assignedBy: {
          $cond: {
            if: { $gt: [{ $size: "$assignedByUsers" }, 0] },
            then: {
              _id: { $arrayElemAt: ["$assignedByUsers._id", 0] },
              name: { $arrayElemAt: ["$assignedByUsers.name", 0] },
              email: { $arrayElemAt: ["$assignedByUsers.email", 0] },
            },
            else: null,
          },
        },
      },
    },
    {
      $sort: {
        [sortField]: sortOrder,
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    tasks,
  });
};


// Fetch Particular Task
export const fetchParticularTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new AppError("Invalid task ID", 400);
  }

  const tasks = await TaskModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: "assignments",
        localField: "_id",
        foreignField: "taskId",
        as: "assignments",
      },
    },
    {
      $unwind: {
        path: "$assignments",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignments.memberId",
        foreignField: "_id",
        as: "assignedUser",
      },
    },
    {
      $unwind: {
        path: "$assignedUser",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$_id",
        taskName: { $first: "$taskName" },
        description: { $first: "$description" },
        status: { $first: "$status" },
        priority: { $first: "$priority" },
        startDate: { $first: "$startDate" },
        endDate: { $first: "$endDate" },
        assignedBy: { $first: "$assignedBy" },
        attachedLead: { $first: "$attachedLead" },
        attachedClient: { $first: "$attachedClient" },
        attachedVisaApplication: { $first: "$attachedVisaApplication" },
        attachedConsultation: { $first: "$attachedConsultation" },
        assignedTo: {
          $push: {
            userId: "$assignedUser._id",
            email: "$assignedUser.email",
            name: "$assignedUser.name",
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedBy",
        foreignField: "_id",
        as: "assigner",
      },
    },
    {
      $unwind: {
        path: "$assigner",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        taskId: "$_id",
        taskName: 1,
        description: 1,
        status: 1,
        priority: 1,
        startDate: 1,
        endDate: 1,
        attachedLead: 1,
        attachedClient: 1,
        attachedVisaApplication: 1,
        attachedConsultation: 1,
        assignedTo: 1,
        assignedBy: {
          userId: "$assigner._id",
          email: "$assigner.email",
          name: "$assigner.name",
        },
      },
    },
  ]);

  if (!tasks.length) {
    throw new AppError("Task not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Task fetched successfully",
    data: tasks[0],
  });
};
