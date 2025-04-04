export enum Roles {
    CUSTOMER="CUSTOMER",
    ADMIN="ADMIN"
}

export interface User {
  token: string;
  role: Roles;
}
