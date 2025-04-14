export type ConsultationSample = {
    Name: string;
    Email: string;
    status: "SCHEDULED" | "COMPLETED" | "CANCELLED"; 
    startTime: Date;
    endTime: Date;
    joinUrl: string;
    calendlyEventUrl: string;
    formattedDate?: string;
    leadId: string;
  };