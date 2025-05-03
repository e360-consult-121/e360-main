"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleEligibilityForm = void 0;
const priorityTrigger_1 = require("../../services/emails/triggers/admin/eligibility-form-filled/priorityTrigger");
const handleEligibilityForm = async (req, res) => {
    const { firstName, serviceType, email } = req.body;
    // Validation check
    if (!firstName || !serviceType || !email) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    // Assuming your eligibility check logic goes here
    const eligibilityStatus = serviceType === 'Dubai Business Setup' ? 'Eligible' : 'Not Eligible';
    // Prepare the email variables for the admin
    const dashboardLink = 'Link to Dashboard'; // You can generate the actual link here, if needed
    let priority = 'LOW'; // Default priority is low
    // Determine the lead priority based on eligibility
    if (eligibilityStatus === 'Eligible') {
        priority = 'HIGH'; // High priority for eligible leads
    }
    else if (eligibilityStatus === 'Not Eligible') {
        priority = 'LOW'; // Low priority for not eligible leads
    }
    else {
        priority = 'MEDIUM'; // Medium priority for potentially eligible leads
    }
    // Call the leadEmailToAdmin function to send email to the admin
    await (0, priorityTrigger_1.leadEmailToAdmin)(firstName, serviceType, priority);
    // Send the response after email is sent
    return res.status(200).json({
        message: 'Eligibility form successfully submitted, and email has been sent!',
        data: { firstName, serviceType, email, eligibilityStatus },
    });
};
exports.handleEligibilityForm = handleEligibilityForm;
