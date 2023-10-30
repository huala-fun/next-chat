"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";

export const LeaveModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "leaveGroup";
  const { group } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/group/${group?.id}/leave`);

      onClose();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            离开群组
          </DialogTitle>
          <DialogDescription className=" text-zinc-500">
            此操作将会离开<span className="font-semibold text-indigo-500">{group?.name}</span> 群组 ,是否继续?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100">
          <div className="flex items-center justify-between w-full">
            <Button
             size={"sm"}
              disabled={isLoading}
              onClick={onClose}
              variant="ghost"
            >
              取消
            </Button>
            <Button
              size={"sm"}
              disabled={isLoading}
              onClick={onClick}
            >
              确认
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}