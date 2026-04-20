"use server";

import { httpClient } from "@/lib/axios/httpClient";
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
