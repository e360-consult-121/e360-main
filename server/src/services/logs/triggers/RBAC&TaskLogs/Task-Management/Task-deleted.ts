import { createLog } from "../../../createLog";
import { formatDateTime } from "../../../../../utils/formatDateTime";
import { logTypeEnum } from "../../../../../types/enums/enums";
import { Types } from "mongoose";
import {LogModel} from "../../../../../models/logsModels/logModel";

export const logTaskDeleted = async ({
  taskTitle,
  deletedAt = new Date(),
  adminName,
  taskId
}: {
  taskTitle: string;
  deletedAt?: Date;
  adminName?: string;
  taskId : Types.ObjectId | null;
}) => {
  const dateTime = formatDateTime(deletedAt);
  const msg = `Task "${taskTitle}" was deleted on ${dateTime} by ${adminName}`;

  await LogModel.create({
    logMsg: msg,
    logType: logTypeEnum.TaskLogs,
    taskId,
  });
};
