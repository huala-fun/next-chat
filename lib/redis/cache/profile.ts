import type { User } from "@prisma/client";
import { redis } from "../redis";

const genUsersKey = (userId: string) => `PROFILE:${userId}`;

/**
 * 设置 User 缓存
 * @param inviteCode
 * @param groupId
 */
export const setUserCache = async (userId: string, user: User) => {
  try {
    await redis.set(genUsersKey(userId), user);
  } catch (e) {
    console.log("setGroupMembesCacheError", e);
  }
};

/**
 * 获取 User
 * @param inviteCode
 */
export const getUserCache = async (userId: string) => {
  try {
    const user = await redis.get(genUsersKey(userId));
    return user;
  } catch (e) {
    console.log("setGroupMembesCacheError", e);
  }
  return null;
};
