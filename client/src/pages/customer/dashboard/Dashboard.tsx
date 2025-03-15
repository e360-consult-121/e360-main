import ApplicationCard from "../../../components/ApplicationCard";
import CustomTable from "../../../components/CustomTable";

const Dashboard = () => {
  return (
    <div className="w-full h-full overflow-y-auto pb-44 px-5 custom-scrollbar">
      {/* Ongoing applications section */}
      <div>
        <h1 className="text-xl text-neutrals-950 font-bold">
          Ongoing Applications
        </h1>

        <div className="mt-5 flex flex-wrap gap-4">
          <ApplicationCard />
          <ApplicationCard />
          <ApplicationCard />
          <ApplicationCard />
          <ApplicationCard />
          <ApplicationCard />
          <ApplicationCard />
        </div>
      </div>

      {/* Pending actions section */}
      <div className="mt-10">
        <h1 className="text-xl text-neutrals-950 font-bold">Pending Actions</h1>

        <div className="mt-5">
          <CustomTable
            headers={["Tasks", "Applicaton", "Action"]}
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
