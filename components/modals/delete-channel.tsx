"use client";

import qs from "query-string";
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

export const DeleteChannelModal = () => {


  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "deleteChannel";
  const { group, channel } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      await axios.delete("/api/channel/", {
        data: {
          channelId: channel?.id,
          groupId: group?.id
        }
      });
      onClose();
      router.refresh();
      router.push(`/group/${group?.id}`);
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
            删除频道
          </DialogTitle>
          <DialogDescription>
            此操作将会永远删除 <br />
            <span className="text-indigo-500 font-semibold">#{channel?.name}</span> 群组
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex items-center justify-end">
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
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}