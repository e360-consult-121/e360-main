import { createLog } from "../../../createLog";
import { logTypeEnum } from "../../../../../types/enums/enums" ;
import { formatDateTime } from "../../../../../utils/formatDateTime";

export const logLeadCame = async ({
  doneBy,
  leadName,
  createdAt = new Date(),
}: {
  doneBy?: string | null;
  leadName: string;
  createdAt?: Date;
}) => {
  const timeStr = formatDateTime(createdAt);
  const msg = `Lead "${leadName}" entered the system on ${timeStr}`;
  
  await createLog({
    logMsg: msg,
    doneBy,
    logType: logTypeEnum.LeadLogs,
  });
};
