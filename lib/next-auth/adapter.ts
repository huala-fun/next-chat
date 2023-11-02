import { Prisma, PrismaClient, Session, User } from "@prisma/client";
import { Adapter } from "next-auth/adapters";
import { NextId } from "../flake-id-gen";

/** @return { import("next-auth/adapters").Adapter } */
export function CustomPrismaAdapter(p: PrismaClient): Adapter {
  return {
    /**
     * 创建用户
     * @param data
     * @returns
     */
    createUser: (user: { email: string; emailVerified: Date | null }) => {
      const [name] = user.email.split("@");
      return p.user.create({
        data: {
          id: NextId(),
          name,
          ...user,
        },
      });
    },
    /**
     * 通过 ID 获取用户
     * @param id
     * @returns
     */
    getUser: (id: User["id"]) => {
      return p.user.findUnique({ where: { id } });
    },
    /**
     * 通过邮箱获取用户
     * @param email
     * @returns
     */
    getUserByEmail: (email: User["email"]) =>
      p.user.findUnique({ where: { email } }),
    /**
     * 根据 provider 以及 providerAccountId 获取用户
     * @param provider_providerAccountId
     * @returns
     */
    async getUserByAccount(
      provider_providerAccountId: Prisma.AccountProviderProviderAccountIdCompoundUniqueInput
    ) {
      const account = await p.account.findUnique({
        where: { provider_providerAccountId },
        select: { user: true },
      });
      return account?.user ?? null;
    },
    /**
     * 更新用户
     * @param param0
     * @returns
     */
    updateUser: ({ id, ...data }: Partial<User> & Pick<User, "id">) =>
      p.user.update({ where: { id }, data }),
    /**
     * 删除用户
     * @param id
     * @returns
     */
    deleteUser: (id: User["id"]) => p.user.delete({ where: { id } }),
    // /**
    //  * 连接账户
    //  *
    //  * @param data
    //  * @returns
    //  */
    // linkAccount: (data: Prisma.AccountCreateInput) =>  p.account.create({ data }),

    // /**
    //  * 取消账户
    //  * @param provider_providerAccountId
    //  * @returns
    //  */
    // unlinkAccount: (
    //   provider_providerAccountId: Prisma.AccountProviderProviderAccountIdCompoundUniqueInput
    // ) =>
    //   p.account.delete({
    //     where: { provider_providerAccountId },
    //   }),
    /***
     * 获取会话以及用户
     */
    async getSessionAndUser(sessionToken: string) {
      const userAndSession = await p.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      if (!userAndSession) return null;
      const { user, ...session } = userAndSession;
      return { user, session };
    },
    /**
     * 创建会话
     * @param data
     * @returns
     */
    createSession: (data: {
      sessionToken: string;
      userId: string;
      expires: Date;
    }) =>
      p.session.create({
        data: {
          id: NextId(),
          ...data,
        },
      }),
    /**
     * 更新会话
     * @param data
     * @returns
     */
    updateSession: (data: Partial<Session> & Pick<Session, "sessionToken">) =>
      p.session.update({ where: { sessionToken: data.sessionToken }, data }),
    /**
     * 删除会话
     * @param sessionToken
     * @returns
     */
    deleteSession: (sessionToken: string) =>
      p.session.delete({ where: { sessionToken } }),

    async createVerificationToken(data: Prisma.VerificationTokenCreateInput) {
      const verificationToken = await p.verificationToken.create({ data });
      // @ts-expect-errors // MongoDB needs an ID, but we don't
      if (verificationToken.id) delete verificationToken.id;
      return verificationToken;
    },
    async useVerificationToken(
      identifier_token: Prisma.VerificationTokenIdentifierTokenCompoundUniqueInput
    ) {
      try {
        const verificationToken = await p.verificationToken.delete({
          where: { identifier_token },
        });
        // @ts-expect-errors // MongoDB needs an ID, but we don't
        if (verificationToken.id) delete verificationToken.id;
        return verificationToken;
      } catch (error) {
        // If token already used/deleted, just return null
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
        if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025")
          return null;
        throw error;
      }
    },
  };
}
