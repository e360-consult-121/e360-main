import { NextFunction, Request, Response } from "express";
import axios from "axios";
import AppError from "../../utils/appError";
import { UserModel } from "../../models/Users";
import { LeadModel } from "../../leadModels/leadModel";
import {ConsultationModel} from "../../leadModels/consultationModel"
import { leadStatus } from "../../types/enums/enums";
import { consultationStatus } from "../../types/enums/enums"
import { sendEmail } from "../../utils/sendEmail";

// get all consultations
// pagination bhi lagana hai 
export const getAllConsultations = async (req: Request, res: Response) => {
    const consultations = await ConsultationModel.find();
    res.status(200).json({ consultations });
};


// send consultation link
export const sendConsultationLink = async (req: Request, res: Response) => {

  const leadId = req.params.leadId;

  const lead = await LeadModel.findById(leadId);

  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }

  // const calendlyLink = process.env.CALENDLY_LINK;
  const calendlyLink = `${process.env.CALENDLY_LINK}?leadId=${leadId}`;

  const html = `
    <p>DearDear ${lead.fullName.first} ${lead.fullName.last},</p>
    <p>You have been marked as high-priority. Please schedule your visa consultation using the link below:</p>
    <a href="${calendlyLink}" target="_blank">${calendlyLink}</a>
    <p>Regards,<br/>Visa Team</p>
  `;

  await sendEmail({
    to: lead.email,
    subject: "Schedule Your Visa Consultation",
    html,
  });

  // Update lead status
  lead.leadStatus = leadStatus.CONSULTATIONLINKSENT;
  await lead.save();

  res.status(200).json({ message: "Consultation link sent successfully" });
};


// calendly webhook
export const calendlyWebhook = async (req: Request, res: Response) => {

  const payload = req.body.payload;
  const leadId = payload?.tracking?.leadId;
  const email = payload?.invitee?.email;
  const name = payload?.invitee?.name;
  const calendlyEventUrl = payload?.event?.uri || payload?.invitee?.scheduled_event;
  const startTime = payload?.event?.start_time;
  const endTime = payload?.event?.end_time;

  if (!leadId) {
    return res.status(400).json({ message: "Missing leadId in tracking data" });
  }

  const lead = await LeadModel.findById(leadId);
  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  // Fetch the scheduled event details to get join_url
  const eventRes = await axios.get(calendlyEventUrl, {
    headers: {
      Authorization: `Bearer ${process.env.CALENDLY_API_KEY}`,
    },
  });

  const joinUrl = eventRes.data?.resource?.location?.join_url || "";

  const consultationDate = new Date(startTime);
  const formattedDate = consultationDate.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata", // change as needed
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  await ConsultationModel.create({
    Name: name,
    Email: email,
    calendlyEventUrl,
    startTime,
    endTime,
    joinUrl, // optional if you're getting this elsewhere
    formattedDate,
    lead: lead._id,
  });

  lead.leadStatus = leadStatus.CONSULTATIONSCHEDULED;
  await lead.save();

  res.status(200).json({ message: "Consultation saved and lead updated" });
};




// Mark consultation as completed 
export const markConsultationAsCompleted = async (req: Request, res: Response) => {

  const  consultationId  = req.params.consultationId;

  // 1. Update consultation status
  const updatedConsultation = await ConsultationModel.findByIdAndUpdate(
    consultationId,
    { consultationStatus: consultationStatus.COMPLETED },
    { new: true }
  );

  if (!updatedConsultation) {
    res.status(404);
    throw new Error("Consultation not found");
  }

  // 2. Update lead status
  await LeadModel.findByIdAndUpdate(
    updatedConsultation.leadId,
    { leadStatus: leadStatus.CONSULTATIONDONE }
  );

  res.status(200).json({
    message: "Consultation marked as completed",
  });
};