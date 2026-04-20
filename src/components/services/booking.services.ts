
'use server';

import { httpClient } from '@/lib/axios/httpClient';
import { BookingStatus, IBookingDetailsData, IBookingsListData } from '@/types/booking.types';

export const getBooking = async (queryString: string) => {
	try {
		return await httpClient.get<IBookingsListData>(
			queryString ? `/booking?${queryString}` : '/booking',
		);
	} catch (error) {
		console.log('Error fetching bookings:', error);
		throw error;
	}
};

export const getBookingById = async (id: string) => {
	try {
		return await httpClient.get<IBookingDetailsData>(`/booking/${id}`);
	} catch (error) {
		console.log('Error fetching booking details:', error);
		throw error;
	}
};

export const updateBookingStatus = async (id: string, status: BookingStatus) => {
	try {
		return await httpClient.patch<IBookingDetailsData>(`/booking/${id}/status`, {
			status,
		});
	} catch (error) {
		console.log('Error updating booking status:', error);
		throw error;
	}
};