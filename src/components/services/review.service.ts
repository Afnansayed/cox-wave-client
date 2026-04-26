"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { IReview, IReviewListData, ReviewStatus } from "@/types/review.types";

export const getReviews = async (queryString?: string) => {
	try {
		return await httpClient.get<IReviewListData>(
			queryString ? `/review?${queryString}` : "/review",
		);
	} catch (error) {
		console.error("Error fetching reviews:", error);
		throw error;
	}
};

export const updateReviewStatus = async (id: string, status: ReviewStatus) => {
	try {
		return await httpClient.patch<IReview>(`/review/${id}/status`, {
			status,
		});
	} catch (error) {
		console.error("Error updating review status:", error);
		throw error;
	}
};

export const createReview = async ({
	event_id,
	rating,
	comment,
}: {
	event_id: string;
	rating: number;
	comment: string;
}): Promise<ApiResponse<IReview> | ApiErrorResponse> => {
	try {
	 return await httpClient.post<IReview>(`/review`, {
		    event_id,
			rating,
			comment,
		});
	} catch (error : any) {
		const message = error?.response?.data?.message || "Failed to create review. Please try again.";
		console.error("Error creating review:", message);
		return {
			success: false,
			message,
		};
	}
};
