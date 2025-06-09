import { createLog } from "../../../createLog";
import { formatDateTime } from "../../../../../utils/formatDateTime";
import { logTypeEnum } from "../../../../../types/enums/enums";

export const logNewRoleCreated = async ({
  roleName,
  createdAt = new Date(),
  doneBy,
  doneByName,
}: {
  roleName: string;
  createdAt?: Date;
  doneBy?: string | null;
  doneByName: string;
}) => {
  const dateTime = formatDateTime(createdAt);
  const msg = `New role "${roleName}" was created on ${dateTime} by Admin ${doneByName}`;

  await createLog({
    logMsg: msg,
    doneBy,
    logType: logTypeEnum.ActivityLogs,
  });
};
