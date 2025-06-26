import { EmailService } from '../../../EmailService';

export const adminProfileUpdatedEmail = async (
  to: string,                          
  employeeName: string,                
  updatedBy: string,                   
  updatedFields: Record<string, any>   
) => {
  const subject = `Your Admin Profile Has Been Updated`;
  const templateName = 'employee-details-edited';     
  const templateCategory = 'admin/RBAC';        

  await EmailService.getInstance().sendEmail({
    to,
    subject,
    templateName,
    templateCategory,
    variables: {
      employeeName,
      updatedBy,
      updatedFields,
    },
  });
};
