import { createLog } from "../../../createLog";
import { logTypeEnum } from "../../../../../types/enums/enums";
import { formatDateTime } from "../../../../../utils/formatDateTime";

export const logPaymentDone = async ({
  leadName,
  paidAt = new Date(),
  amount,
  currency = "INR",
  doneBy,
}: {
  leadName: string;
  paidAt?: Date;
  amount: number;
  currency?: string;
  doneBy?: string | null;
}) => {
  const dateTime = formatDateTime(paidAt);
  const msg = `"${leadName}" completed payment of ₹${amount} ${currency} on ${dateTime} `;

  await createLog({
    logMsg: msg,
    doneBy,
    logType: logTypeEnum.LeadLogs,
  });
};
