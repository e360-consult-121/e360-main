import ApplicationCard from "../../../features/customer/dashboard/components/ApplicationCard";

const PrevApplications = () => {
  return (
    <div className="w-full h-full px-5">
      {/* All applications section */}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-xl text-neutrals-950 font-bold">
            All Applications
          </h1>

          <div className="flex items-center"></div>
        </div>

        <div className="mt-5 flex flex-wrap gap-4">
          <ApplicationCard />
          <ApplicationCard />
          <ApplicationCard />
          <ApplicationCard />
          <ApplicationCard />
          <ApplicationCard />
        </div>
      </div>
    </div>
  );
};

export default PrevApplications;
