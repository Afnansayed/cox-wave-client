export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface IReview {
  id: string;
  event_id: string;
  customer_id: string;

  rating: number;
  comment: string;

  status: ReviewStatus;

  createdAt: Date;
  updatedAt: Date;

  customer: IReviewCustomer;
  event: IReviewEvent;
}

export interface IReviewCustomer {
  id: string;
  name: string;
  email: string;
  profile_picture?: string | null;
}

export interface IReviewEvent {
  id: string;
  title: string;
  location: string;
}

export interface ICreateReview {
  event_id: string;
  rating: number;
  comment: string;
}

export interface IUpdateReview {
  rating?: number;
  comment?: string;
  status?: ReviewStatus; // admin use
}

export interface IReviewListData {
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data: IReview[];
}

