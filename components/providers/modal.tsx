"use client";

import { useEffect, useState } from "react";

import { EditModal } from "@/components/modals/edit-server";
import { InviteModal } from "@/components/modals/invite";
import { CreateModal } from "@/components/modals/create-server";
import { MembersModal } from "@/components/modals/members";
import { CreateChannelModal } from "@/components/modals/create-channel";
import { LeaveModal } from "@/components/modals/leave-server";
import { DeleteModal } from "@/components/modals/delete-server";
import { DeleteChannelModal } from "@/components/modals/delete-channel";
import { EditChannelModal } from "@/components/modals/edit-channel";
import { MessageFileModal } from "@/components/modals/message-file";
import { DeleteMessageModal } from "@/components/modals/withdraw-message";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateModal />
      <InviteModal />
      <EditModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveModal />
      <DeleteModal />
      <DeleteChannelModal />
      <EditChannelModal />
      <MessageFileModal />
      <DeleteMessageModal />
    </>
  )
}