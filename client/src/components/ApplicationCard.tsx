const ApplicationCard = () => {
  return (
    <div className="flex flex-col w-[352px] bg-neutrals-50 rounded-4xl px-4 py-4">
      <h2 className="text-neutrals-950 font-bold mb-4">Dubai Business Setup</h2>
      <div className="w-full grid grid-cols-2 text-neutrals-950 text-sm gap-y-2">
        <h3 className="font-semibold ">Case ID</h3>
        <p>E360-DXB-001</p>

        <h3 className="font-semibold ">Status</h3>
        <p>Investment Processing</p>

        <h3 className="font-semibold ">Submission Date</h3>
        <p>23 March 2025</p>
      </div>

      <button className=" mt-3 w-full bg-golden-yellow-400 text-neutrals-950 rounded-[20px] text-sm py-2">
        View
      </button>
    </div>
  );
};

export default ApplicationCard;
