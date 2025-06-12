import { LogModel } from "../../models/logsModels/logModel";
import { logTypeEnum } from "../../types/enums/enums";

interface CreateLogInput {
  logMsg: string;
  doneBy?: string | null;
  logType: logTypeEnum;
}

export const createLog = async ({ logMsg, doneBy = null, logType }: CreateLogInput) => {
  try {
    await LogModel.create({
      logMsg,
      doneBy,
      logType,
    });
  } catch (err) {
    console.error("Log creation failed:", err);
  }
};
