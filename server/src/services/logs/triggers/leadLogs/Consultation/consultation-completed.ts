import { createLog } from "../../../createLog";
import { logTypeEnum } from "../../../../../types/enums/enums";
import { formatDateTime } from "../../../../../utils/formatDateTime";

export const logConsultationCompleted = async ({
  leadName,
  completedAt = new Date(),
  doneBy,
  doneByName,
  doneByRole = "Admin",
}: {
  leadName: string;
  completedAt?: Date;
  doneBy?: string | null;
  doneByName: string;
  doneByRole?: "Admin" | "Client";
}) => {
  const dateTime = formatDateTime(completedAt);
  const msg = `Consultation with "${leadName}" marked as completed on ${dateTime} by ${doneByRole} ${doneByName}`;

  await createLog({
    logMsg: msg,
    doneBy,
    logType: logTypeEnum.LeadLogs,
  });
};
