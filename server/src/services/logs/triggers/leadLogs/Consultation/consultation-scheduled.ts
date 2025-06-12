import { createLog } from "../../../createLog";
import { logTypeEnum } from "../../../../../types/enums/enums" ;

export const logConsultationScheduled = async ({
  leadName,
  scheduledAt,
  doneBy,
}: {
  leadName: string;
  scheduledAt: Date;
  doneBy?: string | null;
}) => {
  await createLog({
    logMsg: `Consultation scheduled for "${leadName}" on ${scheduledAt.toLocaleString()}`,
    logType: logTypeEnum.LeadLogs,
    doneBy,
  });
};
