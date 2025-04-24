import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/db";
import { verifyPassword } from "@/app/utils/passwordUtils";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "role" },
      },
      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password ||
          !credentials?.role
        ) {
          throw new Error("Email, password and role are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        console.log("User is ", user);
        if (!user || !user.password || user.role !== credentials.role) {
          throw new Error("Invalid email, password or role");
        }

        const isValidPassword = await verifyPassword(
          credentials.password,
          user.password
        );
        console.log("is valid password ", isValidPassword);

        if (!isValidPassword) {
          throw new Error("Invalid email, password or role");
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours in seconds
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.expires = new Date(token.exp * 1000).toISOString(); // Add to session
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
