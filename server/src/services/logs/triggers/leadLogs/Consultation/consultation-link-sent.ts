import { createLog } from "../../../createLog";
import { logTypeEnum } from "../../../../../types/enums/enums";
import { formatDateTime } from "../../../../../utils/formatDateTime";

export const logConsultationLinkSent = async ({
  leadName,
  sentAt = new Date(),
  doneBy,
  doneByName,
  doneByRole = "Admin", // default if not provided
}: {
  leadName: string;
  sentAt?: Date;
  doneBy?: string | null;
  doneByName: string;
  doneByRole?: "Admin" | "Client";
}) => {
  const dateTime = formatDateTime(sentAt);
  const msg = `Consultation link sent to "${leadName}" on ${dateTime} by ${doneByRole} ${doneByName}`;

  await createLog({
    logMsg: msg,
    doneBy,
    logType: logTypeEnum.LeadLogs,
  });
};
