import { z } from "zod";

export const channelMessageSchema = z.object({
  content: z.string().min(1, {
    message: "content 不能为空.",
  }),
  groupId: z.string().min(1, {
    message: "groupId 不能为空.",
  }),
  channelId: z.string().min(1, {
    message: "channelId 不能为空.",
  }),
  fileUrl: z.optional(z.string()),
  userId: z.string().min(1, {
    message: "userId 不能为空.",
  }),
});
