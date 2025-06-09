import { createLog } from "../../../createLog";
import { formatDateTime } from "../../../../../utils/formatDateTime";
import { logTypeEnum } from "../../../../../types/enums/enums";

export const logEmployeeDeleted = async ({
  employeeName,
  deletedAt = new Date(),
  doneBy,
  doneByName,
}: {
  employeeName: string;
  deletedAt?: Date;
  doneBy?: string | null;
  doneByName: string;
}) => {
  const dateTime = formatDateTime(deletedAt);
  const msg = `Employee "${employeeName}" was removed on ${dateTime} by Admin ${doneByName}`;

  await createLog({
    logMsg: msg,
    doneBy,
    logType: logTypeEnum.ActivityLogs,
  });
};
