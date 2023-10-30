"use client";

import axios from "axios";
import { useState } from "react";
import { CheckIcon, CopyIcon, ReloadIcon } from '@radix-ui/react-icons'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useModal } from "@/hooks/use-modal-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOrigin } from "@/hooks/use-origin";

export const InviteModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const origin = useOrigin();

  const isModalOpen = isOpen && type === "invite";
  const { server } = data;

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);

      onOpen("invite", { server: response.data });
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
            邀请好友
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center mt-2 gap-x-2">
          <Input
            disabled={isLoading}
            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
            value={inviteUrl}
          />
          <Button
            onClick={onNew}
            disabled={isLoading}
            variant="link"
            size="icon"
          >
            <ReloadIcon className="w-4 h-4" />
          </Button>
          <Button disabled={isLoading} variant="link" onClick={onCopy} size="icon">
            {copied
              ? <CheckIcon className="w-4 h-4" />
              : <CopyIcon className="w-4 h-4" />
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}