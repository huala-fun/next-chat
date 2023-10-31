import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { NextId } from "./flake-id-gen";

import { currentUser as cacheUser, setUser } from "@/lib/redis/redis";

export const initialUser = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }
  const currUser = await cacheUser(user.id);
  if (currUser) {
    return currUser;
  }

  const toFindUser = await db.user.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (toFindUser) {
    await setUser(user.id, user);
    return user;
  }

  const newUser = await db.user.create({
    data: {
      id: NextId(),
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });
  return newUser;
};
