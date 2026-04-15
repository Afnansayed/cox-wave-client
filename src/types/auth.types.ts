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


export interface ILoginPayload {
    email: string;
    password: string;
}

// * --------// Types for OTP Verification --------*//  
export interface IVerifyOtpPayload {
    email: string;
    otp: string;
}

export interface IVerifyOtpResponse {
  status: boolean
  token: string
  user: VerifyUser
}

export interface VerifyUser {
  name: string
  email: string
  emailVerified: boolean
  image: any
  createdAt: string
  updatedAt: string
  role: string
  status: string
  needPasswordChange: boolean
  isDeleted: boolean
  deletedAt: any
  id: string
}




//* --------// Types for JWT Decoding --------*//

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