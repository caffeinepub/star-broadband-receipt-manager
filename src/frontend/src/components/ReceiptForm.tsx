import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Receipt } from "../backend.d.ts";
import { useGetNextReceiptNo } from "../hooks/useQueries";

const SPEED_PLANS = [
  "20 MBPS",
  "30 MBPS",
  "40 MBPS",
  "50 MBPS",
  "75 MBPS",
  "100 MBPS",
];
const DURATIONS = ["1 Month", "3 Months", "6 Months", "12 Months"];

interface ReceiptFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (receipt: Receipt) => Promise<void>;
  initialData?: Receipt | null;
  isSubmitting?: boolean;
}

const todayStr = () => {
  const d = new Date();
  return d.toISOString().split("T")[0];
};

const oneMonthLaterStr = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().split("T")[0];
};

const defaultForm = (): Omit<Receipt, "id" | "createdAt"> => ({
  receiptNo: "",
  date: todayStr(),
  dateOfExpiry: oneMonthLaterStr(),
  userId: "",
  mobile: "",
  customerName: "",
  address: "",
  speedPlan: "30 MBPS",
  duration: "1 Month",
  packageValue: "",
  installationCharges: "0",
  total: "",
  balance: "0",
  gst: "0",
  grandTotal: "",
  paymentStatus: "Unpaid",
});

export function ReceiptForm({
  open,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: ReceiptFormProps) {
  const { data: nextNo } = useGetNextReceiptNo();
  const [form, setForm] = useState<Omit<Receipt, "id" | "createdAt">>(
    defaultForm(),
  );
  const [errors, setErrors] = useState<Partial<Record<keyof Receipt, string>>>(
    {},
  );

  // When dialog opens, set form data
  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({
          receiptNo: initialData.receiptNo,
          date: initialData.date,
          dateOfExpiry: initialData.dateOfExpiry,
          userId: initialData.userId,
          mobile: initialData.mobile,
          customerName: initialData.customerName,
          address: initialData.address,
          speedPlan: initialData.speedPlan,
          duration: initialData.duration,
          packageValue: initialData.packageValue,
          installationCharges: initialData.installationCharges,
          total: initialData.total,
          balance: initialData.balance,
          gst: initialData.gst,
          grandTotal: initialData.grandTotal,
          paymentStatus: initialData.paymentStatus,
        });
      } else {
        const fresh = defaultForm();
        if (nextNo !== undefined) {
          fresh.receiptNo = nextNo.toString();
        }
        setForm(fresh);
      }
      setErrors({});
    }
  }, [open, initialData, nextNo]);

  // Auto-calculate grand total
  useEffect(() => {
    const total = Number.parseFloat(form.total) || 0;
    const gst = Number.parseFloat(form.gst) || 0;
    const balance = Number.parseFloat(form.balance) || 0;
    const grand = total + gst - balance;
    if (grand >= 0) {
      setForm((prev) => ({ ...prev, grandTotal: grand.toFixed(2) }));
    }
  }, [form.total, form.gst, form.balance]);

  const set = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Receipt, string>> = {};
    if (!form.receiptNo.trim()) newErrors.receiptNo = "Receipt No. is required";
    if (!form.customerName.trim())
      newErrors.customerName = "Customer Name is required";
    if (!form.mobile.trim()) newErrors.mobile = "Mobile is required";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.dateOfExpiry) newErrors.dateOfExpiry = "Expiry date is required";
    if (!form.userId.trim()) newErrors.userId = "User ID is required";
    if (!form.total.trim()) newErrors.total = "Total is required";
    if (!form.grandTotal.trim())
      newErrors.grandTotal = "Grand Total is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const receipt: Receipt = {
      id: initialData?.id ?? BigInt(0),
      createdAt: initialData?.createdAt ?? BigInt(Date.now() * 1_000_000),
      ...form,
    };
    await onSubmit(receipt);
  };

  const isEdit = !!initialData;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="receipt.form.dialog"
        className="max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-brand-navy">
            {isEdit ? "Edit Receipt" : "New Receipt"} — Star Broadband
          </DialogTitle>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          {/* Receipt No */}
          <div className="space-y-1">
            <Label htmlFor="receiptNo" className="text-sm font-semibold">
              Receipt No. <span className="text-destructive">*</span>
            </Label>
            <Input
              id="receiptNo"
              data-ocid="receipt.form.receiptno_input"
              value={form.receiptNo}
              onChange={(e) => set("receiptNo", e.target.value)}
              placeholder="e.g. 1001"
              className={errors.receiptNo ? "border-destructive" : ""}
            />
            {errors.receiptNo && (
              <p
                className="text-xs text-destructive"
                data-ocid="receipt.form.receiptno_error"
              >
                {errors.receiptNo}
              </p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-1">
            <Label htmlFor="date" className="text-sm font-semibold">
              Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="date"
              data-ocid="receipt.form.date_input"
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              className={errors.date ? "border-destructive" : ""}
            />
            {errors.date && (
              <p className="text-xs text-destructive">{errors.date}</p>
            )}
          </div>

          {/* Date of Expiry */}
          <div className="space-y-1">
            <Label htmlFor="dateOfExpiry" className="text-sm font-semibold">
              Date of Expiry <span className="text-destructive">*</span>
            </Label>
            <Input
              id="dateOfExpiry"
              data-ocid="receipt.form.expiry_input"
              type="date"
              value={form.dateOfExpiry}
              onChange={(e) => set("dateOfExpiry", e.target.value)}
              className={errors.dateOfExpiry ? "border-destructive" : ""}
            />
            {errors.dateOfExpiry && (
              <p className="text-xs text-destructive">{errors.dateOfExpiry}</p>
            )}
          </div>

          {/* User ID */}
          <div className="space-y-1">
            <Label htmlFor="userId" className="text-sm font-semibold">
              User ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="userId"
              data-ocid="receipt.form.userid_input"
              value={form.userId}
              onChange={(e) => set("userId", e.target.value)}
              placeholder="e.g. SB-1023"
              className={errors.userId ? "border-destructive" : ""}
            />
            {errors.userId && (
              <p className="text-xs text-destructive">{errors.userId}</p>
            )}
          </div>

          {/* Customer Name */}
          <div className="space-y-1">
            <Label htmlFor="customerName" className="text-sm font-semibold">
              Customer Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="customerName"
              data-ocid="receipt.form.customername_input"
              value={form.customerName}
              onChange={(e) => set("customerName", e.target.value)}
              placeholder="Full Name"
              className={errors.customerName ? "border-destructive" : ""}
            />
            {errors.customerName && (
              <p className="text-xs text-destructive">{errors.customerName}</p>
            )}
          </div>

          {/* Mobile */}
          <div className="space-y-1">
            <Label htmlFor="mobile" className="text-sm font-semibold">
              Mobile No. <span className="text-destructive">*</span>
            </Label>
            <Input
              id="mobile"
              data-ocid="receipt.form.mobile_input"
              value={form.mobile}
              onChange={(e) => set("mobile", e.target.value)}
              placeholder="10-digit mobile"
              className={errors.mobile ? "border-destructive" : ""}
            />
            {errors.mobile && (
              <p className="text-xs text-destructive">{errors.mobile}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="address" className="text-sm font-semibold">
              Address
            </Label>
            <Textarea
              id="address"
              data-ocid="receipt.form.address_input"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="Full address"
              rows={2}
            />
          </div>

          {/* Speed Plan */}
          <div className="space-y-1">
            <Label className="text-sm font-semibold">Speed Plan</Label>
            <Select
              value={form.speedPlan}
              onValueChange={(v) => set("speedPlan", v)}
            >
              <SelectTrigger data-ocid="receipt.form.speedplan_select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SPEED_PLANS.map((plan) => (
                  <SelectItem key={plan} value={plan}>
                    {plan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div className="space-y-1">
            <Label className="text-sm font-semibold">Duration</Label>
            <Select
              value={form.duration}
              onValueChange={(v) => set("duration", v)}
            >
              <SelectTrigger data-ocid="receipt.form.duration_select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DURATIONS.map((dur) => (
                  <SelectItem key={dur} value={dur}>
                    {dur}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Package Value */}
          <div className="space-y-1">
            <Label htmlFor="packageValue" className="text-sm font-semibold">
              Package Value (₹)
            </Label>
            <Input
              id="packageValue"
              data-ocid="receipt.form.packagevalue_input"
              type="number"
              min="0"
              value={form.packageValue}
              onChange={(e) => set("packageValue", e.target.value)}
              placeholder="0.00"
            />
          </div>

          {/* Installation Charges */}
          <div className="space-y-1">
            <Label
              htmlFor="installationCharges"
              className="text-sm font-semibold"
            >
              Installation Charges (₹){" "}
              <span className="text-muted-foreground text-xs font-normal">
                (Non-refundable)
              </span>
            </Label>
            <Input
              id="installationCharges"
              data-ocid="receipt.form.installation_input"
              type="number"
              min="0"
              value={form.installationCharges}
              onChange={(e) => set("installationCharges", e.target.value)}
              placeholder="0.00"
            />
          </div>

          {/* Total */}
          <div className="space-y-1">
            <Label htmlFor="total" className="text-sm font-semibold">
              Total (₹) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="total"
              data-ocid="receipt.form.total_input"
              type="number"
              min="0"
              value={form.total}
              onChange={(e) => set("total", e.target.value)}
              placeholder="0.00"
              className={errors.total ? "border-destructive" : ""}
            />
            {errors.total && (
              <p className="text-xs text-destructive">{errors.total}</p>
            )}
          </div>

          {/* Balance */}
          <div className="space-y-1">
            <Label htmlFor="balance" className="text-sm font-semibold">
              Balance (₹)
            </Label>
            <Input
              id="balance"
              data-ocid="receipt.form.balance_input"
              type="number"
              min="0"
              value={form.balance}
              onChange={(e) => set("balance", e.target.value)}
              placeholder="0.00"
            />
          </div>

          {/* GST */}
          <div className="space-y-1">
            <Label htmlFor="gst" className="text-sm font-semibold">
              GST (₹)
            </Label>
            <Input
              id="gst"
              data-ocid="receipt.form.gst_input"
              type="number"
              min="0"
              value={form.gst}
              onChange={(e) => set("gst", e.target.value)}
              placeholder="0.00"
            />
          </div>

          {/* Grand Total */}
          <div className="space-y-1">
            <Label htmlFor="grandTotal" className="text-sm font-semibold">
              Grand Total (₹) <span className="text-destructive">*</span>
              <span className="text-muted-foreground text-xs font-normal ml-1">
                (auto-calculated)
              </span>
            </Label>
            <Input
              id="grandTotal"
              data-ocid="receipt.form.grandtotal_input"
              type="number"
              min="0"
              value={form.grandTotal}
              onChange={(e) => set("grandTotal", e.target.value)}
              placeholder="0.00"
              className={`font-semibold ${errors.grandTotal ? "border-destructive" : "border-brand-navy"}`}
            />
            {errors.grandTotal && (
              <p className="text-xs text-destructive">{errors.grandTotal}</p>
            )}
          </div>

          {/* Payment Status */}
          <div className="space-y-1">
            <Label className="text-sm font-semibold">Payment Status</Label>
            <Select
              value={form.paymentStatus}
              onValueChange={(v) => set("paymentStatus", v)}
            >
              <SelectTrigger data-ocid="receipt.form.paymentstatus_select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Paid">
                  <span className="text-brand-success font-semibold">
                    ✓ Paid
                  </span>
                </SelectItem>
                <SelectItem value="Unpaid">
                  <span className="text-destructive font-semibold">
                    ✗ Unpaid
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-4 gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="receipt.form.cancel_button"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            data-ocid="receipt.form.submit_button"
            disabled={isSubmitting}
            className="bg-brand-navy hover:bg-brand-navy-mid text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "Updating..." : "Saving..."}
              </>
            ) : isEdit ? (
              "Update Receipt"
            ) : (
              "Save Receipt"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
