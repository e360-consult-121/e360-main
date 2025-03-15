const CustomTable = ({
  headers,
  contents,
}: {
  headers: string[];
  contents: any[] | undefined;
}) => {
  return (
    <table className="w-full text-left ">
      <thead className="[&>tr]:border-b [&>tr]:border-neutrals-200 [&>tr>th]:py-3 [&>tr>th]:text-xs [&>tr>th]:text-neutrals-400 hidden sm:table-header-group">
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody className="[&>tr>td]:py-4 [&>tr>td]:text-neutrals-950 [&>tr>td]:text-xs">
        {contents?.map((content, index) => (
          <tr key={index}>
            {Object.keys(contents[0]).map((field, index) => (
              <td key={index}>{content[field]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CustomTable;
