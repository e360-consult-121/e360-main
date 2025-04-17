export interface AllConsultationsTypes {
  _id: string;
  name: string;
  email: string;
  status: 'SCHEDULED' | 'CANCELLED' | 'COMPLETED';
  startTime: string; 
  endTime: string;   
  joinUrl: string;
  calendlyEventUrl: string;
  formattedDate: string;
  leadId: string;
  __v: number;
}
