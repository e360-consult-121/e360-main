export type  ConsultationInfoTypes = {
    consultationId:string,
    meetTime : string,
    joinUrl: string,
    status:string
    rescheduleUrl:string;
} | undefined

export type  PaymentInfoTypes = {
    status:string,
    method:string,
    invoice:string
} | undefined 

export type EligibilityFormTypes =  {
    [key: string]: string | number | boolean | null | EligibilityFormTypes | Array<any>;
  } | undefined