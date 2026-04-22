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

// export interface IRegisterPayload {
//   name: string;
//   email: string;
//   password: string;
// }

export interface IRegisterResponse {
  token : string;
  accessToken : string;
  refreshToken : string;
  user: VerifyUser
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

// * --------// Types for Change Password --------*//
export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface IChangePasswordResponse {
  token: string;
  user: VerifyUser;
}

// * --------// Types for Forgot / Reset Password --------*//
export interface IForgotPasswordPayload {
  email: string;
}

export interface IResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface IForgotPasswordResponse {
  status?: boolean;
}

export interface IResetPasswordResponse {
  status?: boolean;
}

export interface VerifyUser {
  name: string
  email: string
  emailVerified: boolean
  image: string | null
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


export interface IAdmin {
        id: string;
        name: string;
        email: string;
        profile_picture: string | null;
        phone_number: string | null;
        address: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        createdAt: string;
        updatedAt: string;
        user_id: string;
}
export interface ICustomer {
        id: string;
        name: string;
        email: string;
        profile_picture: string | null;
        phone_number: string | null;
        address: string | null;
        isDeleted: boolean;
        deletedAt: string | null;
        createdAt: string;
        updatedAt: string;
        user_id: string;
}

