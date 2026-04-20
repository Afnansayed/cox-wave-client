export interface ICreateBookingPayload {
  event_id: string;
  seats: number;
}

export interface IBookingCustomer {
  id: string;
  name: string;
  email: string;
  profile_picture: string | null;
}

export interface IBookingEvent {
  id: string;
  title: string;
  location: string;
  images: string[];
  per_person_price: number;
  status: string;
}

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "PROCESSING";
export type PaymentStatus = "PAID" | "UNPAID";

export interface IBooking {
  id: string;
  event_id: string;
  customer_id: string;
  seats: number;
  total_amount: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IPayment {
  id: string;
  booking_id: string;
  amount: number;
  transaction_id: string;
  stripe_event_id: string | null;
  status: PaymentStatus;
  payment_gateway_data: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface IBookingListItem extends IBooking {
  customer: IBookingCustomer;
  event: IBookingEvent;
  payment: IPayment | null;
}

export interface IBookingsListData {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: IBookingListItem[];
}

export interface ICreateBookingResponse {
  booking: IBooking;
  payment: IPayment;
  paymentUrl: string;
}

export type IBookingDetailsData = IBookingListItem;
