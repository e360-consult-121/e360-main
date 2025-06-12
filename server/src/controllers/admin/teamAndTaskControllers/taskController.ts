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


export const addNewTask = async (req: Request, res: Response) => {
  const {
    taskName,
    description,
    priority,
    startDate,
    endDate,
    attachedLead,
    attchedVisaApplication,
  } = req.body;

  let { assignedTo } = req.body;

  // Validate required fields
  if (!taskName || !priority || !startDate || !endDate || !assignedTo) {
    res.status(400);
    throw new Error("Required fields are missing.");
  }

  if (typeof assignedTo === "string") {
    assignedTo = JSON.parse(assignedTo); // Convert JSON string to array
  }

  // Ensure assignedTo is an array
  if (!Array.isArray(assignedTo)) {
    res.status(400);
    throw new Error("assignedTo must be an array of user IDs.");
  }

  // Handle file uploads (Multer + S3)
  const files = (req.files as Express.Multer.File[] | undefined)?.map(
    (file) => (file as any).location
  ) || [];

  let attchedClient = undefined;

  // Get client (userId) from visa application
  if (attchedVisaApplication) {
    const visaApp = await VisaApplicationModel.findById(attchedVisaApplication).select("userId");
    if (!visaApp) {
      res.status(404);
      throw new Error("Visa Application not found.");
    }
    attchedClient = visaApp.userId;
  }

  let attchedConsultation = undefined;

  // Get consultation from lead if available
  if (attachedLead) {
    const consultation = await ConsultationModel.findOne({ leadId: attachedLead }).select("_id");
    if (consultation) {
      attchedConsultation = consultation._id;
    }
  }

  // Create the task
  const newTask = new TaskModel({
    taskName,
    description,
    priority,
    startDate,
    endDate,
    attachedLead,
    attchedVisaApplication,
    attchedClient,
    attchedConsultation,
    files,
    status: taskStatusEnum.DUE,
  });

  const savedTask = await newTask.save();

  // Create assignments
  const assignments = assignedTo.map((userId: string) => ({
    taskId: savedTask._id,
    memberId: userId,
    assignedBy: req.admin?.id, // assumes `req.admin.id` exists via auth middleware
  }));

  if (assignments.length > 0) {
    await AssignmentModel.insertMany(assignments);
  }

  res.status(201).json({
    message: "Task created successfully",
    task: savedTask,
  });
};
 




// API for edit task 
// REq type -->> only send required fields 
// And send only thise fields from fronte d (which are updated , not all )
export const editTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  const {
    taskName,
    description,
    priority,
    startDate,
    endDate,
    attachedLead,
    attachedVisaApplication,
    assignedTo,
    status
  } = req.body;

  // Validate assignedTo as an array
  if (assignedTo && !Array.isArray(assignedTo)) {
    res.status(400).json({ message: "assignedTo must be an array of user IDs" });
    return;
  }

  const task = await TaskModel.findById(taskId);
  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  // Convert uploaded files to S3 URLs (if any)
  const newFiles = (req.files as Express.Multer.File[] | undefined)?.map(
    (file) => (file as any).location
  ) || [];

  // Fetch updated client from visa application if provided
  let attachedClient = task.attachedClient;
  if (attachedVisaApplication) {
    const visaApp = await VisaApplicationModel.findById(attachedVisaApplication).select("userId");
    if (!visaApp) {
      res.status(404).json({ message: "Visa application not found corresponding to attachedVisaApplication" });
      return;
    }
    attachedClient = visaApp.userId as unknown as mongoose.Types.ObjectId;
  }

  // Fetch updated consultation from lead if provided
  let attachedConsultation = task.attachedConsultation;
  if (attachedLead) {
    const consultation = await ConsultationModel.findOne({ leadId: attachedLead }).select("_id");
    if (consultation) {
      attachedConsultation = consultation._id as unknown as mongoose.Types.ObjectId;
    }
  }

  // Update fields only if valid
  if (taskName !== undefined) task.taskName = taskName;
  if (description !== undefined) task.description = description;
  if (priority !== undefined && priority !== "") task.priority = priority;
  if (startDate !== undefined && startDate !== "") task.startDate = startDate;
  if (endDate !== undefined && endDate !== "") task.endDate = endDate;
  if (attachedLead !== undefined) task.attachedLead = attachedLead;
  if (attachedVisaApplication !== undefined) task.attachedVisaApplication = attachedVisaApplication;
  if (attachedClient !== undefined) task.attachedClient = attachedClient;
  if (attachedConsultation !== undefined) task.attachedConsultation = attachedConsultation;
  if(status !== undefined) task.status = status

  // Merge & deduplicate files
  task.files = Array.from(new Set([...task.files, ...newFiles]));

  const updatedTask = await task.save();

  // Update assignments
  if (assignedTo) {
    // Delete existing assignments
    await AssignmentModel.deleteMany({ taskId });

    const assignments = assignedTo.map((memberId: string) => ({
      taskId: task._id,
      memberId,
      assignedBy: req.admin?.id,
    }));

    if (assignments.length > 0) {
      await AssignmentModel.insertMany(assignments);
    }
  }

  return res.status(200).json({
    message: "Task updated successfully",
    task: updatedTask,
  });
};



// Deleting a task 
export const deleteTask = async (req: Request, res: Response): Promise<Response> => {

  const adminId = req.admin?.id;
  if (!adminId) {
    throw new AppError("Admin not authenticated", 401);
  }

  const { taskId } = req.params;
  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
    throw new AppError("Valid taskId is required", 400);
  }

  const task = await TaskModel.findById(taskId);
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  // Delete the task
  await TaskModel.findByIdAndDelete(taskId);

  // Delete all assignments associated with the task
  await AssignmentModel.deleteMany({ taskId });

  return res.status(200).json({
    success: true,
    message: "Task and associated assignments deleted successfully",
  });
};


