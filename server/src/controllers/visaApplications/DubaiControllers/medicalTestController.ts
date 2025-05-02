
import { NextFunction, Request, Response } from "express";
import AppError from "../../../utils/appError";
import { MedicalTestModel } from "../../../extraModels/medicalTestModel";
import { medicalTestStatus } from "../../../types/enums/enums";
import mongoose, { Types } from "mongoose";

// For Admin
export const uploadMedicalTestDetails = async (req: Request, res: Response) => {
  const { stepStatusId } = req.params;
  const {
    date,
    time,
    hospitalName,
    address,
    contactNumber
  } = req.body;


  // Create new document
  const newTest = await MedicalTestModel.create({
    date,
    time,
    hospitalName,
    address,
    contactNumber, 
    status : medicalTestStatus.Scheduled , 
    stepStatusId
  });

  return res.status(201).json({
    message: "Medical test details uploaded successfully",
    createdDoc: newTest
  });
};



// For Admin
export const markTestAsCompleted= async (req: Request, res: Response) => {
  const { stepStatusId } = req.params;

  const test = await MedicalTestModel.findOne({ stepStatusId });

  if (!test) {
    return res.status(404).json({ message: "Medical test not found for the given stepStatusId" });
  }

  test.status = medicalTestStatus.Completed;
  await test.save();

  res.status(200).json({
    message: "Medical test marked as completed",
    updatedDoc: test,
  });
};


// For User
export const sendReschedulingReq = async (req: Request, res: Response) => {
  const { stepStatusId } = req.params;
  const { date, time } = req.body; 

  const test = await MedicalTestModel.findOne({ stepStatusId });

  if (!test) {
    return res
      .status(404)
      .json({ message: "Medical test not found for the given stepStatusId" });
  }

  // Prevent reschedule if already requested or if already completed
  if ( test.status === medicalTestStatus.RescheduleReq_Sent || test.status === medicalTestStatus.Completed ) {
    return res.status(400).json({
      message:
        test.status === medicalTestStatus.Completed
          ? "Cannot reschedule a completed test"
          : "Reschedule request already sent",
    });
  }

  test.status = medicalTestStatus.RescheduleReq_Sent;
  test.requestedSlot = { date, time };
  await test.save();

  res.status(200).json({
    message: "Reschedule request sent successfully",
    updatedDoc: test,
  });
};





// For Admin
export const approveReschedulingReq = async (req: Request, res: Response) => {
  const { stepStatusId } = req.params;

  const test = await MedicalTestModel.findOne({ stepStatusId });

  if (!test) {
    return res.status(404).json({ message: "Medical test not found for the given stepStatusId" });
  }

  if (test.status !== medicalTestStatus.RescheduleReq_Sent || !test.requestedSlot) {
    return res.status(400).json({ message: "No reschedule request found to approve" });
  }

  // Update with the new date and time
  test.date = test.requestedSlot?.date ?? test.date;  // If null, retain original date
  test.time = test.requestedSlot?.time ?? test.time;  // If null, retain original time
  test.requestedSlot = null;
  test.status = medicalTestStatus.RescheduleReq_Approved;

  await test.save();

  res.status(200).json({
    message: "Reschedule request approved and test details updated",
    updatedDoc: test,
  });
};




// For User
export const rejectReschedulingReq = async (req: Request, res: Response) => {
  const { stepStatusId } = req.params;

  const test = await MedicalTestModel.findOneAndUpdate(
    {
      stepStatusId,
      status: medicalTestStatus.RescheduleReq_Sent, // only update if this status is set
    },
    {
      status: medicalTestStatus.RescheduleReq_Rejected,
      requestedSlot: null,
    },
    { new: true } // return updated doc
  );

  if (!test) {
    return res.status(400).json({
      message: "Either medical test not found or no reschedule request was sent",
    });
  }

  res.status(200).json({
    message: "Reschedule request rejected successfully",
    data: test,
  });
};




// For Common 
export const fetchMedicalTestInfo = async (req: Request, res: Response) => {
  const { stepStatusId } = req.params;

  const test = await MedicalTestModel.findOne({ stepStatusId });

  if (!test) {
    return res.status(200).json({ message: "No medical test found", data: null });
  }

  return res.status(200).json({
    message: "Medical test details fetched successfully",
    medicalInfo: test,
  });
};


// return wala case bhi dekhna hai ....

