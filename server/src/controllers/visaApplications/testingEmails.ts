
import { NextFunction, Request, Response } from "express";
import { EmailService }  from "../../services/emails/EmailService";
import { leadEmailToAdmin }  from "../../services/emails/triggers/admin/eligibility-form-filled/priorityTrigger";



export const handleEligibilityForm = async (req: Request, res: Response) => {
    const { firstName, serviceType, email } = req.body;
  
    // Validation check
    if (!firstName || !serviceType || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    // Assuming your eligibility check logic goes here
    const eligibilityStatus = serviceType === 'Dubai Business Setup' ? 'Eligible' : 'Not Eligible';
  
    // Prepare the email variables for the admin
    const dashboardLink = 'Link to Dashboard'; // You can generate the actual link here, if needed
  
    let priority: 'high' | 'medium' | 'low' = 'low'; // Default priority is low
  
    // Determine the lead priority based on eligibility
    if (eligibilityStatus === 'Eligible') {
      priority = 'high';  // High priority for eligible leads
    } else if (eligibilityStatus === 'Not Eligible') {
      priority = 'low';   // Low priority for not eligible leads
    } else {
      priority = 'medium';  // Medium priority for potentially eligible leads
    }
  
    // Call the leadEmailToAdmin function to send email to the admin
    await leadEmailToAdmin(
      email,  // Admin email address (this could be dynamic or stored)
      firstName,
      serviceType,
      dashboardLink,
      priority
    );
  
    // Send the response after email is sent
    return res.status(200).json({
      message: 'Eligibility form successfully submitted, and email has been sent!',
      data: { firstName, serviceType, email, eligibilityStatus },
    });
  };


