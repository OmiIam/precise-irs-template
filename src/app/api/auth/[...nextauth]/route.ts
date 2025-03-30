
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Here you would typically validate against a database
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // For admin login
        if (credentials.email === "admin@admin.com" && credentials.password === "iXOeNiRqvO2QiN4t") {
          return {
            id: "admin-user",
            email: credentials.email,
            name: "Admin User",
            role: "Admin",
          };
        }
        
        // Add your regular user authentication logic here
        // This is a placeholder for demonstration purposes
        const isValidUser = credentials.email.includes("@") && credentials.password.length >= 6;
        
        if (isValidUser) {
          return {
            id: "user-" + Math.random().toString(36).substring(2, 9),
            email: credentials.email,
            name: credentials.email.split("@")[0],
            role: "User",
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET || "YOUR_FALLBACK_SECRET_KEY_CHANGE_THIS",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
