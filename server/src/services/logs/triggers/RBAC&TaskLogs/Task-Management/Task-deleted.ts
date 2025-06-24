import { createLog } from "../../../createLog";
import { formatDateTime } from "../../../../../utils/formatDateTime";
import { logTypeEnum } from "../../../../../types/enums/enums";
import { Types } from "mongoose";


export const logTaskDeleted = async ({
  taskTitle,
  deletedAt = new Date(),
  doneBy = null,
  doneByName,
}: {
  taskTitle: string;
  deletedAt?: Date;
  doneBy?: Types.ObjectId | null;
  doneByName: string;
}) => {
  const dateTime = formatDateTime(deletedAt);
  const msg = `Task "${taskTitle}" was deleted on ${dateTime} by ${doneByName}`;

  await createLog({
    logMsg: msg,
    doneBy,
    logType: logTypeEnum.ActivityLogs,
    visaApplicationId :  null , 
    leadId : null
  });
};
