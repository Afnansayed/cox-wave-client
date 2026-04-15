export interface ILoginResponse {
    token : string;
    accessToken : string;
    refreshToken : string;
    user : {
        needPasswordChange : boolean;
        email : string;
        name : string;
        role : string;
        image: string;
        status : string;
        isDeleted : boolean;
        emailVerified : boolean;
    }
}

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'OWNER';
export type UserStatus = 'ACTIVE' | 'DELETED' | 'BLOCKED';

export interface DecodedToken {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  isDeleted: boolean;
  iat: number; // Issued At (Unix timestamp)
  exp: number; // Expiration (Unix timestamp)
}