import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";


const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),




  ],
});

export { handler as GET, handler as POST };
