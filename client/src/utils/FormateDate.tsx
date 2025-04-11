export const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
  
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" }); // "March"
    const year = date.getFullYear();
  
    return `${day} ${month} ${year}`;
  };