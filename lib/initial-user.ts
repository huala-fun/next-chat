import { currentUser, redirectToSignIn } from "@clerk/nextjs";


import { currentUser as cacheUser, setUser } from "@/lib/redis/redis";

export const initialUser = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }
  const currUser = await cacheUser(user.id);
  return cacheUser;
};
