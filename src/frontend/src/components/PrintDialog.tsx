import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Printer, X } from "lucide-react";
import type { Receipt } from "../backend.d.ts";
import { PrintReceipt } from "./PrintReceipt";

interface PrintDialogProps {
  receipt: Receipt | null;
  onClose: () => void;
}

export function PrintDialog({ receipt, onClose }: PrintDialogProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={!!receipt} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-brand-navy">
            Receipt Preview — {receipt?.customerName}
          </DialogTitle>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="bg-gray-100 p-4 rounded-lg">
          {receipt && <PrintReceipt receipt={receipt} />}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={handlePrint}
            className="bg-brand-navy hover:bg-brand-navy-mid text-white gap-2"
          >
            <Printer className="h-4 w-4" />
            Print Receipt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
