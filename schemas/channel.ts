import { z } from "zod";
import { ChannelType } from "@prisma/client";

export const createChannelSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "频道名称不能为空.",
    })
    .refine((name) => name !== "general", {
      message: "频道名称不能为 'general'",
    }),
  type: z.nativeEnum(ChannelType),
  groupId: z.string().min(1, {
    message: "groupId 不能为空.",
  }),
});


export const updateChannelSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "频道名称不能为空.",
    })
    .refine((name) => name !== "general", {
      message: "频道名称不能为 'general'",
    }),
  type: z.nativeEnum(ChannelType),
  groupId: z.string().min(1, {
    message: "groupId 不能为空.",
  })
});

export const deleteChannelSchema = z.object({
  channelId: z.string().min(1, {
    message: "频道 ID 不能为空.",
  }),
  groupId: z.string().min(1, {
    message: "groupId 不能为空.",
  }),
});


