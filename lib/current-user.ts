import { NextApiRequest } from "next";
import { getAuth } from "@clerk/nextjs/server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

import { currentUser as currUser, setUser } from "@/lib/redis/redis";

export const getUserByUserId = async (userId: string) => {
  const user = await currUser(userId);
  if (user) {
    return user;
  }
  const toFindUser = await db.user.findUnique({
    where: {
      userId,
    },
  });
  await setUser(userId, toFindUser);
  return user;
};

export const currentUser = async () => {
  const { userId } = auth();
  if (!userId) {
    return null;
  }
  return await getUserByUserId(userId);
};

export const currentUserPages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return null;
  }
  return await getUserByUserId(userId);
};
