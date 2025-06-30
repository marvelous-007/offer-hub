import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const recipients = ["John Doe", "Jane Smith", "Acme Corp"];

export default function CloseConflictModal({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: (recipient: string, message: string) => void }) {
  const [recipient, setRecipient] = useState(recipients[0]);
  const [message, setMessage] = useState(
    `Hi [Customer name]\n\nWe have closed your conflict and released payment to you.\n\nXYZ team`
  );

  const handleConfirm = () => {
    onConfirm(recipient, message);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="text-md font-medium text-gray-600">Close conflict</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-2">
          <div className="flex flex-col lg:flex-row gap-3 items-center border p-3 border-gray-400/1 rounded-sm">
            <label className="block text-sm font-medium mb-2">Release payment to</label>
            <div className="border flex-1 rounded-md px-3 py-2 flex items-center focus-within:ring-2 focus-within:ring-primary-500">
              <select
                className="w-full bg-transparent outline-none text-base"
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
              >
                {recipients.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-base font-semibold mb-2">Message (Optional)</label>
            <textarea
              className="w-full border rounded-md px-3 py-2 min-h-[120px] text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter className="flex flex-row justify-end gap-2 mt-6">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-full px-6">Cancel</Button>
          </DialogClose>
          <Button onClick={handleConfirm} className="rounded-full px-6 bg-[#002333] hover:bg-[#002333]/90 text-white">
            Close conflict
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 