import { Box } from "@mui/system";
import RecentLeadManagement from "../../../features/admin/dashboard/components/RecentLeadManagment";
import { useEffect, useState } from "react";
import { AllLeads } from "../../../features/admin/leadManagement/leadManagementTypes";
import {
  useFetchRecentConsultationQuery,
  useFetchRecentLeadsQuery,
  useFetchRecentUpdatesQuery,
  useFetchRevenueQuery,
} from "../../../features/admin/dashboard/dashboardApi";
import RecentConsultations from "../../../features/admin/dashboard/components/RecentConsultations";
import { AllConsultationsTypes } from "../../../features/admin/consultations/consultationTypes";
import StatsCard from "../../../features/admin/dashboard/components/StatsCard";
import RevenueCard from "../../../features/admin/dashboard/components/RevenueCard";
import RecentUpdates from "../../../features/admin/dashboard/components/RecentUpdates";
import { RecentUpdatesTypes, RevenueDataTypes } from "../../../features/admin/dashboard/dashboardTypes";

// Main Dashboard Component
const Dashboard = () => {
  const {
    data: recentLeadsData,
    isLoading,
    isError,
  } = useFetchRecentLeadsQuery(undefined);
  
  const { data: fetchedConsultationData } =
    useFetchRecentConsultationQuery(undefined);
  
    const { data: fetchedRecentUpdatesData } =
    useFetchRecentUpdatesQuery(undefined);

    const {data:fetchedRevenueData} = useFetchRevenueQuery(undefined);

  const [leadData, setLeadData] = useState<AllLeads[]>([]);
  const [consultationData, setConsultationData] = useState<
    AllConsultationsTypes[]
  >([]);
  const [recentUpdatesData, setRecentUpdatesData] = useState<RecentUpdatesTypes[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueDataTypes[]>([]);

  useEffect(() => {
    // console.log(fetchedRevenueData)
    if (recentLeadsData && !isLoading && !isError) {
      setLeadData(recentLeadsData.leads ?? []);
    }
  }, [recentLeadsData, isLoading, isError]);

  useEffect(() => {

    if (fetchedConsultationData) {
      setConsultationData(fetchedConsultationData.consultations ?? []);
    }
    if (fetchedRecentUpdatesData) {
      setRecentUpdatesData(fetchedRecentUpdatesData.updates ?? []);
    }
    if (fetchedRevenueData) {
      setRevenueData(fetchedRevenueData.revenue ?? []);
    }
  }, [fetchedConsultationData, fetchedRecentUpdatesData]);

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gap: 1,
          px: 5,
          my: 3,
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        }}
      >
        <StatsCard
          title="New Leads This Month"
          value="721K"
          change="+11.02%"
          bgcolor="#F6F5F5"
        />
        <StatsCard
          title="Lead Conversion Rate"
          value="65%"
          change="-0.03%"
          bgcolor="#FEFDEB"
        />
        <StatsCard
          title="Pending Applications"
          value="1,156"
          change=""
          bgcolor="#F6F5F5"
        />
        <StatsCard
          title="Completed Applications"
          value="239K"
          change=""
          bgcolor="#FEFDEB"
        />
      </Box>
      <Box
        sx={{
          my: 2,
          display: "flex",
          px: 5,
          // alignItems:"center"
        }}
      >
        <RevenueCard 
        data={revenueData}
        />
        <RecentUpdates data={recentUpdatesData} />
      </Box>
      <Box
        sx={{
          my: 3,
          display: "flex",
          px: 1,
          // alignItems:"center"
        }}
      >
        <RecentConsultations data={consultationData} />
        <RecentLeadManagement data={leadData} />
      </Box>
    </>
  );
};

export default Dashboard;
