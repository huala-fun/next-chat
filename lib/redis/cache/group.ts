import { redis } from "../redis";

const genGroupInviteCodeKey = (groupId: string) => `GROUP:${groupId}:INVITE`;

const genInviteCodeGroupKey = (inviteCode: string) =>
  `INVITE:${inviteCode}:GROUP`;

/**
 * 设置邀请码和群组缓存
 * @param inviteCode
 * @param groupId
 */
export const setGroupInviteCodeCache = async (
  inviteCode: string,
  groupId: string
) => {
  try {
    await redis.set(genInviteCodeGroupKey(inviteCode), groupId);
    await redis.set(genGroupInviteCodeKey(groupId), inviteCode);
  } catch (e) {
    console.log("setInviteCacheError", e);
  }
};

/**
 * 移除群组和邀请码的缓存
 * @param inviteCode
 * @param groupId
 */
export const removeGroupInviteCodeCache = async (
  inviteCode: string,
  groupId: string
) => {
  try {
    await redis.del(genInviteCodeGroupKey(inviteCode), groupId);
    await redis.del(genGroupInviteCodeKey(groupId), inviteCode);
  } catch (e) {
    console.log("setInviteCacheError", e);
  }
};

/**
 * 通过邀请码获取群组ID
 * @param inviteCode
 */
export const getGroupIdByInviteCode = async (inviteCode: string) => {
  try {
    return await redis.get(genInviteCodeGroupKey(inviteCode));
  } catch (e) {
    console.log("setInviteCacheError", e);
  }
  return null;
};

/**
 * 通过群组获取邀请码
 * @param inviteCode
 */
export const getInviteCodeByGroupId = async (groupId: string) => {
  try {
    return await redis.get(genGroupInviteCodeKey(groupId));
  } catch (e) {
    console.log("setInviteCacheError", e);
  }
  return null;
};

const genGroupMembersKey = (groupId: string) => `GROUP:MEMBERS:${groupId}`;

/**
 * 设置群组成员缓存
 * @param inviteCode
 * @param groupId
 */
export const setGroupMembersCache = async (
  groupId: string,
  memberId: string
) => {
  try {
    await redis.sadd(genGroupMembersKey(groupId), memberId);
  } catch (e) {
    console.log("setGroupMembesCacheError", e);
  }
};

/**
 * 移除指定群组中频道缓存
 * @param groupId
 * @param channelId
 */
export const removeGourpMembersCache = async (
  groupId: string,
  memberId: string
) => {
  try {
    await redis.srem(genGroupMembersKey(groupId), memberId);
  } catch (e) {
    console.log("setGourpChannelsCacheError", e);
  }
};

/**
 * 获取群组成员缓存
 * @param inviteCode
 */
export const getGroupMembesCache = async (
  groupId: string,
  memberId: string
) => {
  try {
    redis.sismember(genGroupMembersKey(groupId), memberId);
  } catch (e) {
    console.log("setGroupMembesCacheError", e);
  }
  return null;
};

const groupChannelKey = (groupId: string) => `GROUP:${groupId}:CHANNEL`;

/**
 * 设置群组频道缓存
 * @param groupId
 * @param channelId
 */
export const setGroupChannelsCache = async (
  groupId: string,
  channelId: string
) => {
  try {
    await redis.sadd(groupChannelKey(groupId), channelId);
  } catch (e) {
    console.log("setGourpChannelsCacheError", e);
  }
};

/**
 * 移除指定群组中频道缓存
 * @param groupId
 * @param channelId
 */
export const removeGroupChannelsCache = async (
  groupId: string,
  channelId: string
) => {
  try {
    await redis.srem(groupChannelKey(groupId), channelId);
  } catch (e) {
    console.log("setGourpChannelsCacheError", e);
  }
};

/**
 * 获取群组频道缓存
 * @param groupId
 * @param channelId
 */
export const getGroupChannelsCache = async (
  groupId: string,
  channelId: string
) => {
  try {
    redis.sismember(groupChannelKey(groupId), channelId);
  } catch (e) {
    console.log("setGourpChannelsCacheError", e);
  }
  return null;
};
