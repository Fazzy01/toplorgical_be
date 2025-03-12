
export interface User {
    email: string;
    username: string;
    roles: string[] | string;
    id: string | number;
}

export interface UserType {
    email: string;
    username: string;
    roles: string[] | string;
    id: any;
}

export interface DecodedToken {
    id: string;
    email: string;
    username: string;
    roles: string;
  }