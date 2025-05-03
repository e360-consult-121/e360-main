"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = void 0;
const aimaModel_1 = require("../../extraModels/aimaModel");
const updateStatus = async (req, res) => {
    const { aimaId } = req.params;
    const { aimaNumber } = req.body;
    const updatePayload = {
        isCompleted: true,
        completedOn: Date.now(),
    };
    // Only set aimaNumber if it's a non-empty string
    if (aimaNumber && aimaNumber.trim() !== "") {
        updatePayload.aimaNumber = aimaNumber;
    }
    const updatedDoc = await aimaModel_1.aimaModel.findByIdAndUpdate(aimaId, updatePayload, {
        new: true,
    });
    if (!updatedDoc) {
        res.status(404);
        throw new Error("AIMA document not found");
    }
    res.status(200).json({
        message: "AIMA step marked as completed",
        data: updatedDoc,
    });
};
exports.updateStatus = updateStatus;
// "2025-02-12T12:30:00.000Z"
// const isoDate = new Date(Date.now()).toISOString(); 
// {
//     "completedOn": "2025-02-12T12:30:00.000Z"
//  }
// when aimaNumber not present send -->> ""
