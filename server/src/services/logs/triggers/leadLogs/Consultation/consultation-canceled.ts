import { createLog } from "../../../createLog";
import { logTypeEnum } from "../../../../../types/enums/enums";
import { formatDateTime } from "../../../../../utils/formatDateTime";

export const logConsultationCanceled = async ({
  leadName,
  reason,
  canceledAt = new Date(),
  doneBy,
}: {
  leadName: string;
  reason?: string;
  canceledAt?: Date;
  doneBy?: string | null;
}) => {
  const dateTime = formatDateTime(canceledAt);
  const msg = `Consultation for "${leadName}" was canceled on ${dateTime}.${reason ? ` Reason: ${reason}` : ""}`;

  await createLog({
    logMsg: msg,
    doneBy,
    logType: logTypeEnum.LeadLogs,
  });
};
