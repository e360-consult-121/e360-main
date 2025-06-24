import { createLog } from "../../../createLog";
import { formatDateTime } from "../../../../../utils/formatDateTime";
import { logTypeEnum } from "../../../../../types/enums/enums";

export const logNewTaskCreated = async ({
  taskTitle,
  assignedTo,
  createdAt = new Date(),
  doneBy,
  doneByName,
}: {
  taskTitle: string;
  assignedTo: string;
  createdAt?: Date;
  doneBy?: string | null;
  doneByName: string;
}) => {
  const dateTime = formatDateTime(createdAt);
  const msg = `New task "${taskTitle}" assigned to "${assignedTo}" was created on ${dateTime} by ${doneByName}`;

  await createLog({
    logMsg: msg,
    doneBy,
    logType: logTypeEnum.ActivityLogs,
  });
};
