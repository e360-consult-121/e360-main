import { createLog } from "../../../createLog";
import { logTypeEnum } from "../../../../../types/enums/enums";
import { formatDateTime } from "../../../../../utils/formatDateTime";

export const logPaymentLinkSent = async ({
  leadName,
  sentAt = new Date(),
  doneBy,
  doneByName,
}: {
  leadName: string;
  sentAt?: Date;
  doneBy?: string | null;
  doneByName: string;
}) => {
  const dateTime = formatDateTime(sentAt);
  const msg = `Payment link sent to "${leadName}" on ${dateTime} by Admin ${doneByName}`;

  await createLog({
    logMsg: msg,
    doneBy,
    logType: logTypeEnum.LeadLogs,
  });
};
