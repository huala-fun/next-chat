import { Redis } from "@upstash/redis";
import type { User } from "@prisma/client";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export enum redisKeys {
  PROFILE = "PROFILE",
  GROUP = "GROUP",
  CHANNEL = "CHANNEL",
}

export const GenInviteCodeKey = (inviteCode: string) =>
  `GROUP:INVITE:${inviteCode}`;

export const GenGroupMembersKey = (groupId: string) =>
  `GROUP:MEMBERS:${groupId}`;

export const currentUser = async (userId: string) => {
  const userKey = `${redisKeys.PROFILE}:${userId}`;
  try {
    const redisUser = await redis.get(userKey);
    if (redisUser) {
      return redisUser as User;
    }
  } catch (e) {}
  return null;
};

export const setUser = async (userId: string, user: any) => {
  const userKey = `${redisKeys.PROFILE}:${userId}`;
  try {
    await redis.set(userKey, user);
  } catch (e) {}
  return null;
};

export const getGroup = async (groupId: string) => {
  const groupKey = `${redisKeys.GROUP}:${groupId}`;
  try {
    const redisGroup = await redis.get(groupKey);
    if (redisGroup) {
      return redisGroup;
    }
  } catch (e) {}
  return null;
};

export const setGroup = async (groupId: string) => {
  const groupKey = `${redisKeys.GROUP}:${groupId}`;
  try {
    await redis.set(groupKey, 1);
  } catch (e) {}
};
