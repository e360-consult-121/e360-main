import { Request, Response } from "express";
import axios from "axios";
import { LeadModel } from "../../leadModels/leadModel";
import { ConsultationModel } from "../../leadModels/consultationModel";
import { leadPriority, leadStatus } from "../../types/enums/enums";
import { consultationStatus } from "../../types/enums/enums";
import { sendHighPriorityLeadEmail } from "../../services/emails/triggers/leads/eligibility-form-filled/highPriority";
import { sendMediumPriorityLeadEmail } from "../../services/emails/triggers/leads/eligibility-form-filled/mediumPriority";
import { consultationCallScheduledAdmin } from "../../services/emails/triggers/admin/consultation/consultation-call-scheduled";
import { getServiceType } from "../../utils/leadToServiceType";
import { constultationCallScheduled } from "../../services/emails/triggers/leads/consultation/consultation-call-scheduled";
import { TaskModel } from "../../models/teamAndTaskModels/taskModel";
// get all consultations
// pagination bhi lagana hai
export const getAllConsultations = async (req: Request, res: Response) => {
  const matchStage: any = {};

  if (Array.isArray(req.assignedIds) && req.assignedIds.length > 0) {
    matchStage._id = { $in: req.assignedIds };
  }
    
  const consultations = await ConsultationModel.aggregate([
    { $match: matchStage },
    {
      $addFields: {
        statusOrder: {
          $switch: {
            branches: [
              { case: { $eq: ["$status", "SCHEDULED"] }, then: 0 },
              { case: { $eq: ["$status", "CANCELLED"] }, then: 1 },
              { case: { $eq: ["$status", "COMPLETED"] }, then: 2 },
            ],
            default: 3,
          },
        },
        sortTime: {
          $cond: {
            if: { $eq: ["$status", "SCHEDULED"] },
            then: { $multiply: [-1, { $toLong: "$startTime" }] }, // negate for descending
            else: { $toLong: "$startTime" }, // ascending
          },
        },
      },
    },
    {
      $sort: {
        statusOrder: 1,
        sortTime: 1,
      },
    },
    {
      $project: {
        statusOrder: 0,
        sortTime: 0,
      },
    },
  ]);

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

  let serviceType="";
  const calendlyLink = `${process.env.CALENDLY_LINK}?utm_campaign=${leadId}&utm_source=EEE360`;

  const visaType = lead.__t?.replace("Lead", "");
  if (visaType === "Dominica") {
    serviceType = "Dominica Passport";
  } else if (visaType === "Grenada") {
    serviceType = "Grenada Passport";
  } else if (visaType === "Portugal") {
    serviceType = "Portugal D7 Visa";
  } else if (visaType === "Dubai") {
    serviceType = "Dubai Business Setup";
  }

  if (lead.additionalInfo?.priority === leadPriority.HIGH) {
    await sendHighPriorityLeadEmail(
      lead.email,
      lead.fullName.first,
      serviceType,
      calendlyLink
    );
  }
  else{
    await sendMediumPriorityLeadEmail(
      lead.email,
      lead.fullName.first,
      serviceType,
      calendlyLink
    )
  }
  // const calendlyLink = process.env.CALENDLY_LINK;
  // const calendlyLink = `${process.env.CALENDLY_LINK}?utm_campaign=${leadId}`;
  // const html = `
  //   <p>DearDear ${lead.fullName.first} ${lead.fullName.last},</p>
  //   <p>You have been marked as high-priority. Please schedule your visa consultation using the link below:</p>
  //   <a href="${calendlyLink}" target="_blank">${calendlyLink}</a>
  //   <p>Regards,<br/>Visa Team</p>
  // `;

  // await sendEmail({
  //   to: lead.email,
  //   subject: "Schedule Your Visa Consultation",
  //   html,
  // });

  // await sendEmail({
  //   to: lead.email,
  //   subject: "Schedule Your Visa Consultation",
  //   html,
  // });

  // console.log(`this is your calendly urllll : ${calendlyLink}`);

  // Update lead status
  lead.leadStatus = leadStatus.CONSULTATIONLINKSENT;
  await lead.save();

  res
    .status(200)
    .json({ message: "Consultation link sent successfully", calendlyLink });
};

// calendly webhook
export const calendlyWebhook = async (req: Request, res: Response) => {
  console.log(
    `[Webhook Triggered] Calendly webhook hit at ${new Date().toISOString()}`
  );
  // console.log(`Raw request body:`, JSON.stringify(req.body, null, 2));

  const calendlyEvent = req.body.event;
  const payload = req.body.payload;

  const source = payload?.tracking?.utm_source || "";

  console.log(`this is our sourece : ${source}`);

  const leadId = payload?.tracking?.utm_campaign; // if you're setting leadId in Calendly tracking parameters

  // const email = payload?.email;
  // const name = payload?.name;
  const calendlyEventUrl = payload?.uri;
  const startTime = payload?.scheduled_event?.start_time;
  // const endTime = payload?.scheduled_event?.end_time;
  const rescheduleUrl = payload?.reschedule_url;

  //  Proceed only if source is EEE360
  if (source !== "EEE360") {
    console.log(`Webhook source is not EEE360. Ignoring this event.`);
    res
      .status(200)
      .json({ message: "Webhook source is not EEE360, skipping." }); // res status ko change karna hai
    return;
  }

  if (!leadId) {
    console.log(
      `Actually leadId is not present in meta data , so we can't proceed further and returning`
    );
    res.status(400).json({ message: "Missing leadId in tracking data" });
    return;
  }

  const lead = await LeadModel.findById(leadId);

  // const caseId = lead?.caseId;
  // console.log(`this is your caseId : ${caseId}`);

  if (!lead) {
    console.log(`lead is not not present for this leadId : ${leadId}`);
    res.status(404).json({ message: "Lead not found" });
    return;
  }

  // case - 1
  if (calendlyEvent === "invitee.created") {
    const eventRes = await axios.get(payload.scheduled_event.uri, {
      headers: {
        Authorization: `Bearer ${process.env.CALENDLY_API_KEY}`,
      },
    });

    // const joinUrl = eventRes.data?.resource?.location?.join_url || "";
    const joinUrl = payload?.scheduled_event?.location.join_url || "";

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

    await consultationCallScheduledAdmin(lead.fullName.first, getServiceType(lead.__t ?? ""), formattedDate, joinUrl);
    await constultationCallScheduled(lead.email, lead.fullName.first, getServiceType(lead.__t ?? ""), formattedDate, joinUrl,lead.additionalInfo?.priority);
    
    const newConsultation = await ConsultationModel.create({
      name: payload?.name,
      email: payload?.email,
      calendlyEventUrl: payload?.uri, // ek particular consultation/schedule ki info ke liye use hota hai ...
      startTime: payload?.scheduled_event?.start_time,
      endTime: payload?.scheduled_event?.end_time,
      joinUrl,
      rescheduleUrl,
      formattedDate,
      leadId: leadId,
      // caseId: lead.caseId,
    });

    // Update the  consultation id in taskModel
    await TaskModel.updateMany(
      { attachedLead: leadId }, // condition: jis task me ye leadId ho
      { $set: { attachedConsultation: newConsultation._id } } 
    );

    console.log(
      `Consultation created: ${JSON.stringify(newConsultation, null, 2)}`
    );

    lead.leadStatus = leadStatus.CONSULTATIONSCHEDULED;
    await lead.save();

    console.log(`Lead status updated successfully: ${lead.leadStatus}`);

    res.status(200).json({ message: "Consultation created and lead updated" });
    return;
  } else if (calendlyEvent === "invitee.canceled") {
    console.log(`*****invitee.canceled event is triggered***`);
    console.log(`*****invitee.canceled event is triggered***`);
    console.log(`*****invitee.canceled event is triggered***`);
    console.log(`*****invitee.canceled event is triggered***`);
    console.log(`*****invitee.canceled event is triggered***`);

    console.log(
      `This is Raw request body in cancel event:`,
      JSON.stringify(req.body, null, 2)
    );

    const consultation = await ConsultationModel.findOne({ calendlyEventUrl });

    if (consultation) {
      await ConsultationModel.deleteOne({ calendlyEventUrl });
      console.log(`Consultation deleted for this  event: ${calendlyEventUrl}`);
      console.log(`Consultation deleted for this  event: ${calendlyEventUrl}`);
      console.log(`Consultation deleted for this  event: ${calendlyEventUrl}`);
    }

     // Update the  consultation id in taskModel
     await TaskModel.updateMany(
      { attachedLead: leadId }, // condition: jis task me ye leadId ho
      { $set: { attachedConsultation: null } } 
    );

    // Optional: Update lead status
    // lead.leadStatus = leadStatus.CONSULTATIONCANCELLED || "PENDING";
    // await lead.save();

    res
      .status(200)
      .json({ message: "Consultation cancelled and lead updated" });
    return;
  }

  // Unhandled or future events
  console.log("Unhandled Calendly event:", calendlyEvent);
  return res.status(200).json({ message: "Unhandled event received" });
};

// Mark consultation as completed
export const markConsultationAsCompleted = async (
  req: Request,
  res: Response
) => {
  const consultationId = req.params.consultationId;

  // 1. Update consultation status
  const updatedConsultation = await ConsultationModel.findByIdAndUpdate(
    consultationId,
    { status: consultationStatus.COMPLETED },
    { new: true }
  );

  if (!updatedConsultation) {
    res.status(404);
    throw new Error("Consultation not found");
  }

  // 2. Update lead status
  await LeadModel.findByIdAndUpdate(updatedConsultation.leadId, {
    leadStatus: leadStatus.CONSULTATIONDONE,
  });

  res.status(200).json({
    message: "Consultation marked as completed",
  });
};
