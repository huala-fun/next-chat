import { getServerSession } from "next-auth";
import { nextAuthOption } from "./options";

export const serverSession = async () => {
  return await getServerSession(nextAuthOption);
};

export const sessionUser = async () => {
  const session = await serverSession();
  return session?.user;
};
