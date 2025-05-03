"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToRecentUpdates = void 0;
const recentUpdatesModel_1 = require("../leadModels/recentUpdatesModel");
const addToRecentUpdates = async (data) => {
    console.log("Inside addToRecentUpdates", data);
    try {
        await recentUpdatesModel_1.RecentUpdatesModel.create({
            caseId: data.caseId,
            name: data.name,
            status: data.status,
        });
        const count = await recentUpdatesModel_1.RecentUpdatesModel.countDocuments();
        //store only 10 recent applicants
        if (count > 10) {
            await recentUpdatesModel_1.RecentUpdatesModel.findOneAndDelete({}, { sort: { _id: 1 } });
        }
        console.log("Visa application update added successfully.");
    }
    catch (error) {
        console.error("Error adding visa update:", error);
        throw error;
    }
};
exports.addToRecentUpdates = addToRecentUpdates;
