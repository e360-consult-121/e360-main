import { createLog } from "../../../createLog";
import { formatDateTime } from "../../../../../utils/formatDateTime";
import { logTypeEnum } from "../../../../../types/enums/enums";

export const logRolePermissionsUpdated = async ({
  roleName,
  updatedAt = new Date(),
  doneBy,
  doneByName,
}: {
  roleName: string;
  updatedAt?: Date;
  doneBy?: string | null;
  doneByName: string;
}) => {
  const dateTime = formatDateTime(updatedAt);
  const msg = `Permissions for role "${roleName}" were updated on ${dateTime} by Admin ${doneByName}`;

  await createLog({
    logMsg: msg,
    doneBy,
    logType: logTypeEnum.ActivityLogs,
  });
};
