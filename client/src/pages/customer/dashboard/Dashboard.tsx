import CustomTable from "../../../components/CustomTable";
import ApplicationCard from "../../../features/customer/dashboard/components/ApplicationCard";
import { useGetApplicationsQuery } from "../../../features/customer/dashboard/dashboardApi";

const Dashboard = () => {
  const { data, isLoading, isError } = useGetApplicationsQuery(undefined);

  return (
    <div className="w-full h-full overflow-y-auto pb-44 px-5 custom-scrollbar">
      
      {/* Ongoing applications section */}
      <div>
        <h1 className="text-xl text-neutrals-950 font-bold">
          Ongoing Applications
        </h1>

        <div className="mt-5 flex flex-wrap gap-4">
          {isLoading ? (
            <p>Loading applications...</p>
          ) : isError ? (
            <p>Error fetching applications.</p>
          ) : data?.data?.length > 0 ? (
            data.data.map((application: any) => (
              <ApplicationCard
                key={application._id}
                caseId={application._id}
                status={application.visaApplicationStatus}
                submissionDate={"23 March 2025"} 
                title={application.visaTypeId?.visaType || "Unknown Visa"}
              />
            ))
          ) : (
            <p>No ongoing applications.</p>
          )}
        </div>
      </div>

      {/* Pending actions section */}
      <div className="mt-10">
        <h1 className="text-xl text-neutrals-950 font-bold">Pending Actions</h1>

        <div className="mt-5">
          <CustomTable
            headers={["Tasks", "Application", "Action"]}
            contents={[
              {
                task: "Upload missing documents for your trade license application.",
                application: "Dubai Business Setup",
                action: "View",
              },
              {
                task: "Upload missing documents for your trade license application.",
                application: "Dubai Business Setup",
                action: "View",
              },
              {
                task: "Upload missing documents for your trade license application.",
                application: "Dubai Business Setup",
                action: "View",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
