"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchParticularVisaApplication = void 0;
const VisaType_1 = require("../../models/VisaType");
const VisaApplication_1 = require("../../models/VisaApplication");
const fetchParticularVisaApplication = async (req, res) => {
    const { visaType } = req.query;
    if (!visaType) {
        return res.status(400).json({ error: 'visaType query parameter is required' });
    }
    try {
        const visaTypeDoc = await VisaType_1.VisaTypeModel.findOne({ visaType });
        if (!visaTypeDoc) {
            return res.status(404).json({ error: 'Visa type not found' });
        }
        const applications = await VisaApplication_1.VisaApplicationModel.find({ visaTypeId: visaTypeDoc._id })
            .sort({ createdAt: -1 })
            .populate('userId')
            .populate('visaTypeId')
            .populate('leadId');
        return res.status(200).json({ visaApplications: applications });
    }
    catch (error) {
        console.error('Error fetching visa applications:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.fetchParticularVisaApplication = fetchParticularVisaApplication;
