export interface ICreateBookingPayload {
  event_id: string;
  seats: number;
}

export interface IBooking {
  id: string;
  event_id: string;
  customer_id: string;
  seats: number;
  total_amount: number;
  status: string;
  payment_status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPayment {
  id: string;
  booking_id: string;
  amount: number;
  transaction_id: string;
  stripe_event_id: string | null;
  status: string;
  payment_gateway_data: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateBookingResponse {
  booking: IBooking;
  payment: IPayment;
  paymentUrl: string;
}
