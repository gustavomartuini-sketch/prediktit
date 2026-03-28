import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// Production imports (uncomment when DB is ready):
// import GoogleProvider from 'next-auth/providers/google';
// import { PrismaAdapter } from '@next-auth/prisma-adapter';
// import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Demo user store (replace with Prisma in production)
const demoUsers = [
  { id: 'demo-1', email: 'demo@prediktit.com', username: 'demo_trader', password: '$2a$12$LJ3P/fCA6vGHXhTmfXqVYeL8UOy.qJZfNOILOUOLX8TQfXPJVLEOC', role: 'USER', playBalance: 10000 },
  { id: 'admin-1', email: 'admin@prediktit.com', username: 'admin_chief', password: '$2a$12$LJ3P/fCA6vGHXhTmfXqVYeL8UOy.qJZfNOILOUOLX8TQfXPJVLEOC', role: 'ADMIN', playBalance: 100000 },
];

export const authOptions = {
  // Production: adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        // Demo mode: check in-memory users
        const user = demoUsers.find(u => u.email === credentials.email);

        if (!user) {
          // In demo mode, auto-create user
          const newUser = {
            id: `user_${Date.now()}`,
            email: credentials.email,
            username: credentials.email.split('@')[0],
            role: 'USER',
            playBalance: 10000,
          };
          demoUsers.push(newUser);
          return newUser;
        }

        // Production: const isValid = await bcrypt.compare(credentials.password, user.password);
        // For demo, accept any password
        return {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        };
      },
    }),

    // Crypto Wallet auth
    CredentialsProvider({
      id: 'wallet',
      name: 'Crypto Wallet',
      credentials: {
        address: { label: 'Wallet Address', type: 'text' },
        signature: { label: 'Signature', type: 'text' },
        message: { label: 'Message', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.address || !credentials?.signature) {
          throw new Error('Wallet address and signature required');
        }

        // Verify signature with ethers.js
        const { ethers } = await import('ethers');
        try {
          const recoveredAddress = ethers.verifyMessage(credentials.message, credentials.signature);
          if (recoveredAddress.toLowerCase() !== credentials.address.toLowerCase()) {
            throw new Error('Invalid signature');
          }
        } catch (e) {
          throw new Error('Signature verification failed');
        }

        // Demo: auto-create wallet user
        const existing = demoUsers.find(u => u.walletAddress === credentials.address.toLowerCase());
        if (existing) return existing;

        const user = {
          id: `wallet_${Date.now()}`,
          email: `${credentials.address.slice(0, 10)}@wallet.prediktit.com`,
          username: `wallet_${credentials.address.slice(0, 8)}`,
          walletAddress: credentials.address.toLowerCase(),
          role: 'USER',
          playBalance: 10000,
        };
        demoUsers.push(user);
        return user;
      },
    }),

    // Production: add Google OAuth
    // ...(process.env.GOOGLE_CLIENT_ID ? [GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })] : []),
  ],

  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.walletAddress = user.walletAddress;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.role = token.role;
      session.user.walletAddress = token.walletAddress;
      return session;
    },
  },

  pages: { signIn: '/login', signUp: '/register', error: '/login' },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-change-in-production',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
