import { Redis } from "@upstash/redis";
import type { Profile } from "@prisma/client";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export enum redisKeys {
  PROFILE = "PROFILE",
  GROUP = "GROUP",
  CHANNEL = "CHANNEL",
}

export const currentProfile = async (userId: string) => {
  const profileKey = `${redisKeys.PROFILE}:${userId}`;
  try {
    const redisProfile = await redis.get(profileKey);
    if (redisProfile) {
      return redisProfile as Profile;
    }
  } catch (e) {}
  return null;
};

export const setProfile = async (userId: string, profile: any) => {
  const profileKey = `${redisKeys.PROFILE}:${userId}`;
  try {
    await redis.set(profileKey, profile);
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
