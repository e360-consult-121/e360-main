export enum Roles {
    USER="USER",
    ADMIN="ADMIN"
}

export interface User {
  token: string;
  role: Roles;
}
