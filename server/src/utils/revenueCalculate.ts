import { RevenueModel } from "../leadModels/revenueModel";
import { VisaTypeModel } from "../models/VisaType";
import { VisaTypeEnum } from "../types/enums/enums";

export const updateRevenueSummary = async (visaTypeId: string, amount: number) => {
  
  try {
    console.log("Inside updateRevenueSummary", visaTypeId, amount);

    const visaTypeInfo = await VisaTypeModel.findById(visaTypeId);
    if (!visaTypeInfo) {
      console.error("VisaType not found for ID:", visaTypeId);
      return;
    }

    const visaTypeName = visaTypeInfo.visaType as VisaTypeEnum;
    console.log("Updating revenue for:", visaTypeName);

    await RevenueModel.findOneAndUpdate(
      { visaType: visaTypeName },
      { $inc: { totalRevenue: amount } },
      { upsert: true, new: true }
    );

    console.log("Revenue updated successfully");

  } catch (error) {
    console.error("Error updating revenue summary:", error);
  }
};
