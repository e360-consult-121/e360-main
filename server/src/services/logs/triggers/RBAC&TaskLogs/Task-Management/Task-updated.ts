import { createLog } from "../../../createLog";
import { formatDateTime } from "../../../../../utils/formatDateTime";
import { logTypeEnum } from "../../../../../types/enums/enums";
import { Types } from "mongoose";


export const logTaskUpdated = async ({
  taskTitle,
  updatedFields,
  updatedAt = new Date(),
  doneBy = null,
  doneByName,
}: {
  taskTitle: string;
  updatedFields: string[]; // e.g., ["status", "due date"]
  updatedAt?: Date;
  doneBy?: Types.ObjectId | null;
  doneByName: string;
}) => {
  const dateTime = formatDateTime(updatedAt);
  const fields = updatedFields.join(", ");
  const msg = `Task "${taskTitle}" was updated (${fields}) on ${dateTime} by ${doneByName}`;

  await createLog({
    logMsg: msg,
    doneBy,
    logType: logTypeEnum.ActivityLogs,
    visaApplicationId :  null , 
    leadId : null
  });
};
