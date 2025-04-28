import { EmailService } from '../../../EmailService';

export const leadEmailToAdmin = async (
  to: string, 
  firstName: string, 
  service: string, 
  dashboardLink: string, 
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
) => {
  let subject = '';
  let templateName = '';

  // Determine the subject and template based on priority
  switch (priority) {
    case 'HIGH':
      subject = `High-Priority Lead Alert: ${firstName} – ${service}`;
      templateName = 'high-priority-form-filled';
      break;
    case 'MEDIUM':
      subject = `Review Needed: Potential Lead for ${firstName} – ${service}`;
      templateName = 'medium-priority-form-filled';
      break;
    case 'LOW':
      subject = `Non-Eligible Lead for ${firstName} – ${service}`;
      templateName = 'low-priority-form-filled';
      break;
  }

  // Send the email using the determined subject and template
  await EmailService.getInstance().sendEmail({
    to,
    subject,
    templateName,
    templateCategory: 'admin/eligibility-form-filled',
    variables: {
      FirstName: firstName,
      Service: service,
      LinkToDashboard: dashboardLink,
    },
  });
};