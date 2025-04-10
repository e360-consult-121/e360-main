export enum AccountStatusEnum {
  ACTIVE = 'ACTIVE',                                      // Account is active and fully operational.
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',          // Account is awaiting email verification or admin approval.
  SUSPENDED = 'SUSPENDED',                                // Account is temporarily suspended (e.g., due to policy violations).
  CLOSED = 'CLOSED',                                      // Account has been closed (voluntary or due to violation).
  BANNED = 'BANNED',                                      // Account has been permanently banned (e.g., for illegal activities).
  INACTIVE = 'INACTIVE',                                  // Account is inactive, often due to a long period of no activity.
  LOCKED = 'LOCKED',                                      // Account is temporarily locked due to security concerns (e.g., failed logins).
  EXPIRED = 'EXPIRED',                                    // Account or subscription has expired (e.g., subscription ended).
}


export enum RoleEnum {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum VisaTypeEnum {
  DOMINICA = "Dominica",
  GRENEDA = "Grenada",
  PORTUGAL = "Portugal",
  DUBAI = "Dubai"
}

export enum FileType {
  IMAGE = "image",
  PDF = "pdf"
}

export enum DocumentSourceEnum {
  ADMIN = "ADMIN",
  USER = "USER"
}

export enum QuestionTypeEnum {
  TEXT = "text",  // Text input.
  EMAIL = "email", //Email input.
  PHONE_NUMBER = "phone",
  DOB = "dob",
  RADIO = "radio",
  CHECKBOX = "checkbox",
  DROPDOWN = "dropdown",
  IMAGE = "image",
  PDF = "pdf",
  SIGNATURE="signature"
}

export enum VisaApplicationStatusEnum {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  REJECTED = "REJECTED",
  APPROVED="APPROVED",
  CANCELED="CANCELED"
}

export enum StepStatusEnum {
  IN_PROGRESS = "IN_PROGRESS",
  SUBMITED = "SUBMITED",
  APPROVED="APPROVED",
  REJECTED = "REJECTED", 
}

export enum visaApplicationReqStatusEnum{
  NOT_UPLOADED="NOT_UPLOADED",
  UPLOADED ="UPLOADED",
  VERIFIED="VERIFIED",  // Mark as verified
  RE_UPLOAD="RE_UPLOAD",
}

export enum StepTypeEnum {
  MEDICAL = "MEDICAL",
  BANK = "BANK",
  DELIVERY = "DELIVERY",
  GENERAL = "GENERAL"
}


export enum leadPriority {
  HIGH = "HIGH",
  LOW = "LOW",
  MEDIUM = "MEDIUM"  
}

export enum leadStatus {
  INITIATED = "INITIATED",
  CONSULTATIONLINKSENT = "CONSULTATIONLINKSENT",
  CONSULTATIONSCHEDULED = "CONSULTATIONSCHEDULED" ,
  CONSULTATIONDONE = "CONSULTATIONDONE" ,
  PAYMENTLINKSENT = "PAYMENTLINKSENT",
  PAYMENTDONE = "PAYMENTDONE" ,
  REJECTED = "REJECTED"
}

export enum consultationStatus {
  SCHEDULED = "SCHEDULED",
  COMPLETED = "COMPLETED",
}

export enum paymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
}