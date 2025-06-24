import { createLog } from "../../../createLog";
import { logTypeEnum } from "../../../../../types/enums/enums" ;
import { formatDateTime } from "../../../../../utils/formatDateTime";
import { Types } from "mongoose";


export const logLeadCame = async ({
  doneBy,
  priority,
  leadName,
  createdAt = new Date(),
}: {
  doneBy: Types.ObjectId | null;
  priority : string;
  leadName: string;
  createdAt?: Date;
}) => {
  const timeStr = formatDateTime(createdAt);
  const msg = `A "${priority}" priority lead "${leadName}" entered the system on ${timeStr}`;
  
  await createLog({
    logMsg: msg,
    doneBy,
    logType: logTypeEnum.LeadLogs,
    leadId : null , 
    visaApplicationId : null
  });
};
