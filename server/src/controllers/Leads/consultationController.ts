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
  // isme ab caseId bhi ja rahi hai 
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

  // await sendEmail({
  //   to: lead.email,
  //   subject: "Schedule Your Visa Consultation",
  //   html,
  // });

   console.log(`this is your calendly urllll : ${calendlyLink}`);

  // Update lead status
  // lead.leadStatus = leadStatus.CONSULTATIONLINKSENT;
  // await lead.save();

  res.status(200).json({ message: "Consultation link sent successfully" ,calendlyLink });
};







// calendly webhook
export const calendlyWebhook = async (req: Request, res: Response) => {
  console.log(`[Webhook Triggered] Calendly webhook hit at ${new Date().toISOString()}`);
  console.log(`Raw request body:`, JSON.stringify(req.body, null, 2));

  const calendlyEvent = req.body.event;
  const payload = req.body.payload;

  const leadId = payload?.tracking?.leadId; // if you're setting leadId in Calendly tracking parameters
  const email = payload?.email;
  const name = payload?.name;
  const calendlyEventUrl = payload?.uri;
  const startTime = payload?.scheduled_event?.start_time;
  const endTime = payload?.scheduled_event?.end_time;

  console.log(`Event Type: ${calendlyEvent}`);
  console.log(`Lead ID from tracking: ${leadId}`);
  console.log(`Invitee Email: ${email}`);
  console.log(`Invitee Name: ${name}`);
  console.log(`Start Time: ${startTime}`);
  console.log(`End Time: ${endTime}`);
  console.log(`Event URL: ${calendlyEventUrl}`);

  if (!leadId) {
    return res.status(400).json({ message: "Missing leadId in tracking data" });
  }

  const lead = await LeadModel.findById(leadId);
  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  if (calendlyEvent === "invitee.created") {
    const eventRes = await axios.get(payload.scheduled_event.uri, {
      headers: {
        Authorization: `Bearer ${process.env.CALENDLY_API_KEY}`,
      },
    });

    const joinUrl = eventRes.data?.resource?.location?.join_url || "";

    const consultationDate = new Date(startTime);
    const formattedDate = consultationDate.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const newConsultation = await ConsultationModel.create({
      Name: name,
      Email: email,
      calendlyEventUrl,
      startTime,
      endTime,
      joinUrl,
      formattedDate,
      lead: lead._id,
      caseId: lead.caseId,
    });

    console.log(`Consultation created: ${JSON.stringify(newConsultation, null, 2)}`);

    lead.leadStatus = leadStatus.CONSULTATIONSCHEDULED;
    await lead.save();

    console.log(`Lead status updated successfully: ${lead.leadStatus}`);

    return res.status(200).json({ message: "Consultation created and lead updated" });
  } 
  
  else if (calendlyEvent === "invitee.canceled") {
    const consultation = await ConsultationModel.findOne({ calendlyEventUrl });

    if (consultation) {
      await ConsultationModel.deleteOne({ calendlyEventUrl });
      console.log(`Consultation deleted for event: ${calendlyEventUrl}`);
    }

    // Optional: Update lead status
    // lead.leadStatus = leadStatus.CONSULTATIONCANCELLED || "PENDING";
    // await lead.save();

    return res.status(200).json({ message: "Consultation cancelled and lead updated" });
  }

  // Unhandled or future events
  console.log("Unhandled Calendly event:", calendlyEvent);
  return res.status(200).json({ message: "Unhandled event received" });
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