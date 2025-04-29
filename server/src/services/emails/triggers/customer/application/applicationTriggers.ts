import { EmailTrigger } from "../../../../../models/VisaStep";
import { PORTAL_LINK, WHATSAPP_LINK } from "../../../../../config/configLinks";
import { EmailService } from "../../../EmailService";
import { VisaTypeEnum } from "../../../../../types/enums/enums";

export const userApplicationUpdateSend = async (
  triggers: EmailTrigger[],
  email: string,
  firstName: string,
  visaType: VisaTypeEnum
) => {
  let templateCategory = "";

  if (visaType === VisaTypeEnum.DOMINICA || visaType === VisaTypeEnum.GRENADA) {
    templateCategory = "customer/application/DominicaGrenada";
  } else if (visaType === VisaTypeEnum.PORTUGAL) {
    templateCategory = "customer/application/Portugal";
  } else if (visaType === VisaTypeEnum.DUBAI) {
    templateCategory = "customer/application/Dubai";
  }

  const emailPromises = triggers.map(async (trigger) => {
    const { templateId, subject } = trigger;
    return EmailService.getInstance().sendEmail({
      to: email,
      subject,
      templateName: templateId,
      templateCategory,
      variables: {
        FirstName: firstName,
        PortalLink: PORTAL_LINK,
        WhatsAppLink: WHATSAPP_LINK,
      },
    });
  });

  await Promise.all(emailPromises);
};
