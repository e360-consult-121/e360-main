import { createLog } from "../../../createLog";
import { formatDateTime } from "../../../../../utils/formatDateTime";
import { logTypeEnum } from "../../../../../types/enums/enums";

export const logNewEmployeeCreated = async ({
  employeeName,
  employeeEmail,
  createdAt = new Date(),
  doneBy,
  doneByName,
}: {
  employeeName: string;
  employeeEmail: string;
  createdAt?: Date;
  doneBy?: string | null;
  doneByName: string;
}) => {
  const dateTime = formatDateTime(createdAt);
  const msg = `New employee "${employeeName}" (${employeeEmail}) was added on ${dateTime} by Admin ${doneByName}`;

  await createLog({
    logMsg: msg,
    doneBy,
    logType: logTypeEnum.ActivityLogs,
  });
};
