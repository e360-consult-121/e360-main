import { createLog } from "../../../createLog";
import { formatDateTime } from "../../../../../utils/formatDateTime";
import { logTypeEnum } from "../../../../../types/enums/enums";

export const logTaskDeleted = async ({
  taskTitle,
  deletedAt = new Date(),
  doneBy,
  doneByName,
}: {
  taskTitle: string;
  deletedAt?: Date;
  doneBy?: string | null;
  doneByName: string;
}) => {
  const dateTime = formatDateTime(deletedAt);
  const msg = `Task "${taskTitle}" was deleted on ${dateTime} by ${doneByName}`;

  await createLog({
    logMsg: msg,
    doneBy,
    logType: logTypeEnum.ActivityLogs,
  });
};
