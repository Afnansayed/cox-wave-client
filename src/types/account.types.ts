export interface IAdmin {
  id: string;
  name: string;
  email: string;
  profile_picture?: string | null;
  phone_number?: string | null;
  address?: string | null;

  isDeleted: boolean;
  deletedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;

  user_id: string;
}

export interface IOwner {
  id: string;
  name: string;
  email: string;
  profile_picture?: string | null;
  phone_number?: string | null;
  address?: string | null;

  business_name?: string | null;
  description?: string | null;
  business_address?: string | null;
  trade_license?: string | null;
  bank_account?: string | null;

  rating?: number;
  total_reviews: number;

  isApproved: boolean;
  isDeleted: boolean;
  deletedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;

  user_id: string;
}


export interface ICustomer {
  id: string;
  name: string;
  email: string;
  profile_picture?: string | null;
  phone_number?: string | null;
  address?: string | null;

  isDeleted: boolean;
  deletedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;

  user_id: string;
}