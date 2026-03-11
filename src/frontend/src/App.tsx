import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  LogIn,
  LogOut,
  Pencil,
  Plus,
  Printer,
  Search,
  Star,
  Trash2,
  Wifi,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Receipt } from "./backend.d.ts";
import { PrintDialog } from "./components/PrintDialog";
import { ReceiptForm } from "./components/ReceiptForm";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  useCreateReceipt,
  useDeleteReceipt,
  useGetAllReceipts,
  useUpdateReceipt,
} from "./hooks/useQueries";

export default function App() {
  const { identity, login, clear, isInitializing, isLoggingIn } =
    useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: receipts, isLoading } = useGetAllReceipts();
  const createReceipt = useCreateReceipt();
  const updateReceipt = useUpdateReceipt();
  const deleteReceipt = useDeleteReceipt();

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null);
  const [printReceipt, setPrintReceipt] = useState<Receipt | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const filteredReceipts = useMemo(() => {
    if (!receipts) return [];
    const q = search.toLowerCase().trim();
    if (!q) return receipts;
    return receipts.filter(
      (r) =>
        r.customerName.toLowerCase().includes(q) ||
        r.receiptNo.toLowerCase().includes(q) ||
        r.mobile.includes(q),
    );
  }, [receipts, search]);

  const handleNewReceipt = () => {
    setEditingReceipt(null);
    setFormOpen(true);
  };

  const handleEdit = (receipt: Receipt) => {
    setEditingReceipt(receipt);
    setFormOpen(true);
  };

  const handlePrint = (receipt: Receipt) => {
    setPrintReceipt(receipt);
  };

  const handleDelete = (id: bigint) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteReceipt.mutateAsync(deleteId);
      toast.success("Receipt deleted successfully");
    } catch {
      toast.error("Failed to delete receipt");
    } finally {
      setDeleteId(null);
    }
  };

  const handleFormSubmit = async (receipt: Receipt) => {
    try {
      if (editingReceipt) {
        await updateReceipt.mutateAsync({ id: editingReceipt.id, receipt });
        toast.success("Receipt updated successfully");
      } else {
        await createReceipt.mutateAsync(receipt);
        toast.success("Receipt created successfully");
      }
      setFormOpen(false);
      setEditingReceipt(null);
    } catch {
      toast.error("Failed to save receipt. Please try again.");
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <header className="bg-brand-navy shadow-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-brand-gold rounded-lg p-2 flex items-center justify-center">
              <Star className="h-5 w-5 text-white fill-white" />
            </div>
            <div>
              <h1 className="font-display text-white text-xl font-black tracking-tight leading-tight">
                STAR BROADBAND
              </h1>
              <p className="text-blue-200 text-xs font-medium tracking-wide">
                Receipt Manager
              </p>
            </div>
          </div>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {isInitializing ? (
              <Skeleton className="h-8 w-24 bg-white/10" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-blue-100 text-sm">
                    {identity.getPrincipal().toString().slice(0, 10)}…
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clear}
                  className="border-white/30 text-white hover:bg-white/10 gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                className="bg-brand-gold hover:bg-brand-gold text-white border-0 gap-2 font-semibold"
              >
                <LogIn className="h-4 w-4" />
                {isLoggingIn ? "Logging in..." : "Login"}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Page Title + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-2xl font-black text-brand-navy">
              Customer Receipts
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {receipts
                ? `${receipts.length} receipt${receipts.length !== 1 ? "s" : ""} total`
                : "Loading..."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                data-ocid="receipt.search_input"
                placeholder="Search name, receipt no…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-56 bg-white"
              />
            </div>

            {/* New Receipt */}
            {isAuthenticated && (
              <Button
                data-ocid="receipt.add_button"
                onClick={handleNewReceipt}
                className="bg-brand-navy hover:bg-brand-navy-mid text-white gap-2 font-semibold shadow-card"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Receipt</span>
              </Button>
            )}
          </div>
        </div>

        {/* Not Authenticated Banner */}
        {!isAuthenticated && !isInitializing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <Wifi className="h-5 w-5 text-brand-navy shrink-0" />
            <div>
              <p className="text-brand-navy font-semibold text-sm">
                Login to manage receipts
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">
                You need to login to create, edit, or delete receipts. You can
                still view and print existing receipts.
              </p>
            </div>
            <Button
              size="sm"
              onClick={login}
              className="ml-auto bg-brand-navy text-white shrink-0"
            >
              Login
            </Button>
          </div>
        )}

        {/* Receipts Table */}
        <div className="bg-white rounded-xl shadow-card border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  className="h-12 w-full"
                  data-ocid="receipt.loading_state"
                />
              ))}
            </div>
          ) : filteredReceipts.length === 0 ? (
            <div
              data-ocid="receipt.empty_state"
              className="flex flex-col items-center justify-center py-16 px-6 text-center"
            >
              <div className="bg-muted rounded-full p-4 mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-1">
                {search ? "No receipts found" : "No receipts yet"}
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                {search
                  ? `No receipts match "${search}". Try a different search.`
                  : "Create your first receipt to get started."}
              </p>
              {!search && isAuthenticated && (
                <Button
                  onClick={handleNewReceipt}
                  className="mt-4 bg-brand-navy text-white gap-2"
                >
                  <Plus className="h-4 w-4" />
                  New Receipt
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table data-ocid="receipt.list">
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-semibold text-foreground w-10">
                      #
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Receipt No.
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Customer Name
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Mobile
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Date
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Expiry
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-right">
                      Grand Total
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReceipts.map((receipt, index) => (
                    <TableRow
                      key={receipt.id.toString()}
                      data-ocid={`receipt.item.${index + 1}`}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <TableCell className="text-muted-foreground text-sm font-mono">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-mono font-semibold text-brand-navy">
                        #{receipt.receiptNo}
                      </TableCell>
                      <TableCell className="font-medium">
                        {receipt.customerName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {receipt.mobile}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {receipt.date}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {receipt.dateOfExpiry}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-brand-navy">
                        ₹{receipt.grandTotal}
                      </TableCell>
                      <TableCell>
                        {receipt.paymentStatus === "Paid" ? (
                          <Badge className="bg-brand-success-bg text-brand-success border-0 font-semibold">
                            ✓ Paid
                          </Badge>
                        ) : (
                          <Badge className="bg-brand-danger-bg text-brand-danger border-0 font-semibold">
                            ✗ Unpaid
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            data-ocid={`receipt.print_button.${index + 1}`}
                            onClick={() => handlePrint(receipt)}
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-brand-navy"
                            title="Print Receipt"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          {isAuthenticated && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                data-ocid={`receipt.edit_button.${index + 1}`}
                                onClick={() => handleEdit(receipt)}
                                className="h-8 w-8 p-0 hover:bg-amber-50 hover:text-amber-600"
                                title="Edit Receipt"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                data-ocid={`receipt.delete_button.${index + 1}`}
                                onClick={() => handleDelete(receipt.id)}
                                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-destructive"
                                title="Delete Receipt"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-brand-gold fill-brand-gold" />
            <span className="font-semibold text-brand-navy">
              Star Broadband
            </span>
            <span>— Stay Connected</span>
          </div>
          <p>
            © {currentYear}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-navy hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {/* Receipt Form Modal */}
      <ReceiptForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingReceipt(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingReceipt}
        isSubmitting={createReceipt.isPending || updateReceipt.isPending}
      />

      {/* Print Dialog */}
      <PrintDialog
        receipt={printReceipt}
        onClose={() => setPrintReceipt(null)}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(v) => !v && setDeleteId(null)}
      >
        <AlertDialogContent data-ocid="receipt.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Receipt?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The receipt will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="receipt.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="receipt.confirm_button"
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteReceipt.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
