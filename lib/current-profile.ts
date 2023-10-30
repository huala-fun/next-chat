import { NextApiRequest } from "next";
import { getAuth } from "@clerk/nextjs/server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

import { currentProfile as currProfile, setProfile } from "@/lib/redis";

export const getProfileByUserId = async (userId: string) => {
  const user = await currProfile(userId);
  if (user) {
    return user;
  }
  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });
  await setProfile(userId, profile);
  return profile;
};

export const currentProfile = async () => {
  const { userId } = auth();
  if (!userId) {
    return null;
  }
  return await getProfileByUserId(userId);
};

export const currentProfilePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return null;
  }
  return await getProfileByUserId(userId);
};
