import { EmailService } from '../../../EmailService';

export const sendForgotPasswordEmail = async (
  name: string, 
  resetLink:string,
  email:string,
) => {
  const subject = `New Password – ${name}`;

  const templateName="forgot-password"
  await EmailService.getInstance().sendEmail({
    to:email,
    subject,
    templateName,
    templateCategory: 'customer/auth',
    variables: {
      Name:name,
      ResetLink:resetLink
    },
  });
};