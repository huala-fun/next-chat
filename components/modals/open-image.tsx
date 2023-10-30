"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import Image from "next/image";

export const OpenImageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "openImage";
  const { src } = data;
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {src && <Image src={src} alt="open" width={100} height={100} />}
      </DialogContent>
    </Dialog>
  );
};
