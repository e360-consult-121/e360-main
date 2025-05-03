"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAnalytics = exports.fetchRecentConsultions = exports.fetchRecentLeads = exports.getRecentUpdates = exports.getAllRevenue = void 0;
const consultationModel_1 = require("../../leadModels/consultationModel");
const leadModel_1 = require("../../leadModels/leadModel");
const recentUpdatesModel_1 = require("../../leadModels/recentUpdatesModel");
const revenueModel_1 = require("../../leadModels/revenueModel");
// Fetch all visaType Revenue
const getAllRevenue = async (req, res) => {
    const revenue = await revenueModel_1.RevenueModel.find();
    res.status(200).json({ revenue });
};
exports.getAllRevenue = getAllRevenue;
// Fetch 5 recent updates from RecentUpdatesDB
const getRecentUpdates = async (req, res) => {
    try {
        const recentUpdates = await recentUpdatesModel_1.RecentUpdatesModel.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate({
            path: 'caseId',
            select: 'leadId', // only fetch leadId from VisaApplication
        });
        res.status(200).json({ updates: recentUpdates });
    }
    catch (error) {
        console.error("Error fetching recent updates:", error);
        res.status(500).json({ message: "Error fetching recent updates" });
    }
};
exports.getRecentUpdates = getRecentUpdates;
// Fetch 5 recent leads 
const fetchRecentLeads = async (req, res) => {
    const leads = await leadModel_1.LeadModel.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json({ leads });
};
exports.fetchRecentLeads = fetchRecentLeads;
//Fetch 5 recent consultations
const fetchRecentConsultions = async (req, res) => {
    const consultations = await consultationModel_1.ConsultationModel.aggregate([
        {
            $match: {
                status: "SCHEDULED",
                startTime: { $gte: new Date() }
            }
        },
        {
            $sort: {
                startTime: -1
            }
        },
        {
            $limit: 5
        }
    ]);
    res.status(200).json({ consultations });
};
exports.fetchRecentConsultions = fetchRecentConsultions;
// returns last 30 Days leads ,%conversions ,pending and completed.  
const fetchAnalytics = async (req, res) => {
    try {
        const now = new Date();
        const startOfRange = new Date();
        startOfRange.setDate(startOfRange.getDate() - 30);
        const leadsLast30Days = await leadModel_1.LeadModel.find({
            createdAt: { $gte: startOfRange }
        });
        const totalLeads = leadsLast30Days.length;
        const completedApplications = leadsLast30Days.filter((lead) => lead.leadStatus === "PAYMENTDONE").length;
        const pendingApplications = leadsLast30Days.filter((lead) => lead.leadStatus !== "PAYMENTDONE" && lead.leadStatus !== "REJECTED").length;
        const leadConversionRate = totalLeads === 0
            ? 0
            : Math.round((completedApplications / totalLeads) * 100);
        res.status(200).json({
            newLeadsLast30Days: totalLeads,
            leadConversionRate: `${leadConversionRate}%`,
            pendingApplications,
            completedApplications
        });
    }
    catch (error) {
        console.error("Error fetching lead stats:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.fetchAnalytics = fetchAnalytics;
