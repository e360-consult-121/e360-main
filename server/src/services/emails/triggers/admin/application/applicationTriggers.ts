import { EmailTrigger } from "../../../../../models/VisaStep";
import { ADMIN_EMAIL, DASHBOARD_LINK } from "../../../../../config/configLinks";
import { EmailService } from "../../../EmailService";
import { VisaTypeEnum } from "../../../../../types/enums/enums";

export const adminApplicationUpdateSend = async (
  triggers: EmailTrigger[],
  customerName: string,
  visaType: VisaTypeEnum
) => {
  let templateCategory = "";

  if (visaType === VisaTypeEnum.DOMINICA || visaType === VisaTypeEnum.GRENADA) {
    templateCategory = "admin/application/DominicaGrenada";
  } else if (visaType === VisaTypeEnum.PORTUGAL) {
    templateCategory = "admin/application/Portugal";
  } else if (visaType === VisaTypeEnum.DUBAI) {
    templateCategory = "admin/application/Dubai";
  }

  const emailPromises = triggers.map(async (trigger) => {
    const { templateId, subject } = trigger;
    return EmailService.getInstance().sendEmail({
      to: ADMIN_EMAIL,
      subject,
      templateName: templateId,
      templateCategory,
      variables: {
        CustomerName: customerName,
        AdminPortalLink: DASHBOARD_LINK,
      },
    });
  });

  await Promise.all(emailPromises);
};
