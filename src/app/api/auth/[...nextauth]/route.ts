
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

// This is a temporary implementation for testing purposes
// In a real app, you would authenticate against your database
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "User",
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "Admin",
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user by email
        const user = users.find(user => user.email === credentials.email);
        
        // Check if user exists and password matches
        if (user && user.password === credentials.password) {
          // Note: In a real app, you would use a proper password hashing method
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }
        
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Pass user id and role to token
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass token properties to session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
