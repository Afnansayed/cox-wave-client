"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getReviews, updateReviewStatus } from "@/components/services/review.service";
import { IReview, ReviewStatus } from "@/types/review.types";
import { cn } from "@/lib/utils";

const getStatusBadgeClassName = (status: ReviewStatus) => {
	if (status === "APPROVED") {
		return "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors border-emerald-500/20";
	}

	if (status === "REJECTED") {
		return "bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors border-destructive/20";
	}

	return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors border-amber-500/20";
};

const DashBoardReviewList = () => {
	const queryClient = useQueryClient();
	const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
	const [activeReview, setActiveReview] = useState<IReview | null>(null);
	const [selectedStatus, setSelectedStatus] = useState<ReviewStatus>("PENDING");

	const { data: reviewResponse, isLoading, isFetching } = useQuery({
		queryKey: ["admin-reviews"],
		queryFn: () => getReviews(),
	});

	const { mutateAsync, isPending } = useMutation({
		mutationFn: ({ reviewId, nextStatus }: { reviewId: string; nextStatus: ReviewStatus }) =>
			updateReviewStatus(reviewId, nextStatus),
	});

	const reviews: IReview[] =
		reviewResponse?.success && Array.isArray(reviewResponse.data?.data)
			? reviewResponse.data.data
			: [];

	const totalReviews = reviewResponse?.success
		? reviewResponse.data?.meta?.total ?? reviews.length
		: 0;

	const isBusy = isLoading || isFetching;

	const statusOptions = useMemo(
		() => [
			{ label: "Approve", value: "APPROVED" as ReviewStatus, variant: "default" as const },
			{ label: "Reject", value: "REJECTED" as ReviewStatus, variant: "destructive" as const },
			{ label: "Set Pending", value: "PENDING" as ReviewStatus, variant: "outline" as const },
		],
		[],
	);

	const openStatusModal = (review: IReview) => {
		setActiveReview(review);
		setSelectedStatus(review.status);
		setIsStatusModalOpen(true);
	};

	const handleStatusUpdate = async (reviewId: string, nextStatus: ReviewStatus) => {
		const toastId = toast.loading("Updating review status...");

		if (!reviewId || !nextStatus) {
			toast.error("Missing review id or status.", { id: toastId });
			return;
		}

		try {
			const response = await mutateAsync({ reviewId, nextStatus });

			if (!response.success) {
				toast.error(response.message || "Failed to update review status.", { id: toastId });
				return;
			}

			await queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
			toast.success(response.message || "Review status updated.", { id: toastId });
		} catch (error: unknown) {
			const message =
				error instanceof Error ? error.message : "Failed to update review status.";
			toast.error(message, { id: toastId });
		}
	};

	const handleModalSubmit = async () => {
		if (!activeReview) {
			return;
		}

		await handleStatusUpdate(activeReview.id, selectedStatus);
		setIsStatusModalOpen(false);
	};

	return (
		<section className="space-y-6 p-4 md:p-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-black text-foreground tracking-tight">Review Management</h1>
					<p className="text-sm text-muted-foreground font-medium">
						Total Reviews: {totalReviews}
					</p>
				</div>
			</div>

			<div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
				<div className="overflow-x-auto">
					<table className="w-full min-w-[920px] text-left">
						<thead className="bg-muted/50 border-b border-border">
							<tr>
								<th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Event</th>
								<th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</th>
								<th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Rating</th>
								<th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Comment</th>
								<th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
								<th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Created</th>
								<th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{isBusy ? (
								[...Array(4)].map((_, i) => (
									<tr key={i}>
										<td className="px-6 py-4" colSpan={7}>
											<div className="h-12 animate-pulse rounded-xl bg-muted/40" />
										</td>
									</tr>
								))
							) : reviews.length === 0 ? (
								<tr>
									<td className="px-6 py-12 text-center text-sm text-muted-foreground font-medium" colSpan={7}>
										No reviews found in the system.
									</td>
								</tr>
							) : (
								reviews.map((review) => (
									<tr key={review.id} className="align-top hover:bg-muted/30 transition-colors">
										<td className="px-6 py-4">
											<p className="font-bold text-foreground">{review.event?.title || "N/A"}</p>
											<p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">{review.event?.location || "N/A"}</p>
										</td>
										<td className="px-6 py-4">
											<p className="font-bold text-foreground">{review.customer?.name || "N/A"}</p>
											<p className="text-xs font-medium text-muted-foreground mt-0.5">{review.customer?.email || "N/A"}</p>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center gap-1">
												<span className="font-black text-foreground">{review.rating}</span>
												<span className="text-[10px] font-bold text-muted-foreground">/ 5</span>
											</div>
										</td>
										<td className="px-6 py-4 max-w-[360px]">
											<p className="line-clamp-3 text-sm text-muted-foreground font-medium leading-relaxed">{review.comment}</p>
										</td>
										<td className="px-6 py-4">
											<Badge variant="outline" className={cn("px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-widest border", getStatusBadgeClassName(review.status))}>
												{review.status}
											</Badge>
										</td>
										<td className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-tighter">
											{new Date(review.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
										</td>
										<td className="px-6 py-4">
											<Button
												type="button"
												size="sm"
												onClick={() => openStatusModal(review)}
												className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-9 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-none border-none"
											>
												Update
											</Button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			<Dialog
				open={isStatusModalOpen}
				onOpenChange={(open) => {
					setIsStatusModalOpen(open);
					if (!open) {
						setActiveReview(null);
					}
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Update Review Status</DialogTitle>
						<DialogDescription>
							Select a new review status and save the change.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-2">
						<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
							Review
						</p>
						<p className="text-sm font-medium">
							{activeReview?.event?.title || "N/A"} - {activeReview?.customer?.name || "N/A"}
						</p>
					</div>

					<div className="space-y-2">
						<p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
							Status
						</p>
						<select
							value={selectedStatus}
							onChange={(e) => setSelectedStatus(e.target.value as ReviewStatus)}
							className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
							disabled={isPending}
						>
							{statusOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setIsStatusModalOpen(false)}
							disabled={isPending}
						>
							Cancel
						</Button>
						<Button
							type="button"
							onClick={handleModalSubmit}
							disabled={isPending || !activeReview || selectedStatus === activeReview?.status}
						>
							{isPending ? "Updating..." : "Save Changes"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</section>
	);
};

export default DashBoardReviewList;
