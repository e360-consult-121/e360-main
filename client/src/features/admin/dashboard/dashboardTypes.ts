export interface RecentUpdatesTypes {
    caseId:string;
    name:string;
    status:string;
  }
  
export interface RevenueDataTypes {
    visaType: VisaTypeEnum;
    totalRevenue: number;
  }

export enum VisaTypeEnum {
    DOMINICA = "Dominica",
    GRENEDA = "Grenada",
    PORTUGAL = "Portugal",
    DUBAI = "Dubai"
  }

