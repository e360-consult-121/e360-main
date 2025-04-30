import { EmailTrigger } from "../../../../../models/VisaStep";
import { PORTAL_LINK, WHATSAPP_LINK } from "../../../../../config/configLinks";
import { EmailService } from "../../../EmailService";
import { VisaTypeEnum } from "../../../../../types/enums/enums";
import { getDgUserSubject } from "../../../templates/customer/application/DominicaGrenada/dg-subjects";

export const userApplicationUpdateSend = async (
  triggers: EmailTrigger[],
  email: string,
  firstName: string,
  visaType: string
) => {
  let templateCategory = "";
  let subjectFn : (firstName: string, templateId: string) => string;

  if (visaType === "Dominica" || visaType === "Grenada") {
    templateCategory = "customer/application/DominicaGrenada";
    subjectFn = getDgUserSubject
  } else if (visaType === VisaTypeEnum.PORTUGAL) {
    templateCategory = "customer/application/Portugal";
  } else if (visaType === VisaTypeEnum.DUBAI) {
    templateCategory = "customer/application/Dubai";
  }

  const emailPromises = triggers.map(async (trigger) => {
    const { templateId } = trigger;
    const subject = subjectFn ? subjectFn(firstName, templateId) : "Application Update";
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
