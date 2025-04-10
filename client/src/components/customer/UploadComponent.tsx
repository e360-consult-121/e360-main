import FileUpload from "./FileUpload";

const UploadComponent = ({ d ,phase}: { d: any,phase:string }) => {
  const type = d.requirementType;
  // console.log(d);
 
    if(type === "IMAGE" || type === "PDF"){
      return <FileUpload
      fileName={d.question}
      fileSize="12"
      fileType={d.requirementType}
      reqStatus={d.reqStatus}
      phase   ={phase}
    />
    } 
    // ) : type === "SELECT_DROPDOWN" ? (
  //   <DropDownComponent 
  //    label={d.label}
  //    options={d.options}
  //   />
  // ) : (
  //   <IconOptionComponent
  //   optionData = {d.options}
  //   />
  // );
};

export default UploadComponent;
