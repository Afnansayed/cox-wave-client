"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateOwnerApprovalStatus } from "@/components/services/owner.service";
import { IOwner } from "@/types/account.types";

type AdminOwnerDetailsProps = {
  owner: IOwner;
};

const AdminOwnerDetails = ({ owner }: AdminOwnerDetailsProps) => {
  const router = useRouter();
  const [isApproved, setIsApproved] = useState(owner.isApproved);
  const [nextApprovalStatus, setNextApprovalStatus] = useState(
    owner.isApproved ? "approved" : "pending",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => updateOwnerApprovalStatus(owner.id),
  });

  const handleApprovalUpdate = async () => {
    const toastId = toast.loading("Updating owner approval...");

    try {
      const approved = nextApprovalStatus === "approved";
      const response = await mutateAsync();

      if (!response.success) {
        toast.error(response.message || "Failed to update approval status.", {
          id: toastId,
        });
        return;
      }

      setIsApproved(approved);
      setIsModalOpen(false);
      toast.success(response.message || "Owner approval status updated.", {
        id: toastId,
      });
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update approval status.";
      toast.error(message, { id: toastId });
    }
  };

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Owner Details</h1>
          <p className="text-sm text-muted-foreground">Owner ID: {owner.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>Change Approval</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Approval Status</DialogTitle>
                <DialogDescription>
                  Approve or move this owner back to pending.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Select Status
                </p>
                <select
                  value={nextApprovalStatus}
                  onChange={(e) => setNextApprovalStatus(e.target.value)}
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                  disabled={isPending}
                >
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApprovalUpdate}
                  disabled={
                    isPending ||
                    (isApproved && nextApprovalStatus === "approved") ||
                    (!isApproved && nextApprovalStatus === "pending")
                  }
                >
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button asChild variant="outline">
            <Link href="/admin-dashboard/owner">Back to Owners</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Name</p>
          <p className="font-semibold">{owner.name}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Email</p>
          <p className="font-semibold break-all">{owner.email}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Phone</p>
          <p className="font-semibold">{owner.phone_number || "N/A"}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Business Name</p>
          <p className="font-semibold">{owner.business_name || "N/A"}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Business Address</p>
          <p className="font-semibold">{owner.business_address || "N/A"}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Address</p>
          <p className="font-semibold">{owner.address || "N/A"}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Rating</p>
          <p className="font-semibold">{owner.rating ?? 0}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Total Reviews</p>
          <p className="font-semibold">{owner.total_reviews}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Approval Status</p>
          <Badge className={isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
            {isApproved ? "APPROVED" : "PENDING"}
          </Badge>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-xs text-muted-foreground">Description</p>
        <p className="mt-2 text-sm leading-relaxed">{owner.description || "N/A"}</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Trade License</p>
          {owner.trade_license ? (
            <a
              href={owner.trade_license}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-sm font-semibold text-primary underline"
            >
              View Trade License
            </a>
          ) : (
            <p className="mt-2 text-sm">N/A</p>
          )}
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Bank Account</p>
          <p className="mt-2 text-sm font-semibold">{owner.bank_account || "N/A"}</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Created At</p>
          <p className="font-semibold">{new Date(owner.createdAt).toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Updated At</p>
          <p className="font-semibold">{new Date(owner.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </section>
  );
};

export default AdminOwnerDetails;
