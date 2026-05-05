"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { EventStatus } from "@/types/event.types"; 

interface UpdateEventStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (status: EventStatus) => Promise<void>;
  currentStatus: EventStatus;
  isPending: boolean;
}

export function UpdateEventStatusModal({
  isOpen,
  onClose,
  onSubmit,
  currentStatus,
  isPending
}: UpdateEventStatusModalProps) {
  const [status, setStatus] = useState<EventStatus>(currentStatus);

  useEffect(() => {
    if (isOpen) setStatus(currentStatus);
  }, [isOpen, currentStatus]);

  const handleUpdate = async () => {
    await onSubmit(status);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] rounded-xl border-border bg-card p-6">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Update Event Status
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Change the current approval status for this event.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Status
          </Label>
          <Select 
            value={status} 
            onValueChange={(value) => setStatus(value as EventStatus)}
          >
            <SelectTrigger className="h-11 rounded-md border-border bg-background focus:ring-primary/20">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="rounded-md border-border bg-card">
              <SelectItem value="APPROVED" className="cursor-pointer">
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <CheckCircle2 size={16} /> Approved
                </div>
              </SelectItem>
              <SelectItem value="PENDING" className="cursor-pointer">
                <div className="flex items-center gap-2 text-sm text-amber-600">
                  <Clock size={16} /> Pending
                </div>
              </SelectItem>
              <SelectItem value="REJECTED" className="cursor-pointer">
                <div className="flex items-center gap-2 text-sm text-rose-600">
                  <XCircle size={16} /> Rejected
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="flex flex-row justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-md"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isPending || status === currentStatus}
            className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-white"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}