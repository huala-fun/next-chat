import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { NextId } from "./flake-id-gen";

import { currentProfile, redisKeys, setProfile } from "@/lib/redis";
import { Profile } from "@prisma/client";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }
  const currProfile = await currentProfile(user.id);
  if (currProfile) {
    return currProfile;
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (profile) {
    await setProfile(user.id, profile);
    return profile;
  }
  
  const newProfile = await db.profile.create({
    data: {
      id: NextId(),
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });
  return newProfile;
};
