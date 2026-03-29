import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export const authOptions = {
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

        try {
          // Find user in database
          let user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });

          if (!user) {
            // Auto-create user in demo mode (any email/password works)
            const hashedPassword = await bcrypt.hash(credentials.password, 12);
            user = await prisma.user.create({
              data: {
                email: credentials.email.toLowerCase(),
                username: credentials.email.split('@')[0] + '_' + Date.now().toString(36),
                password: hashedPassword,
                playBalance: 10000,
              },
            });
          } else {
            // Verify password if user has one
            if (user.password) {
              const isValid = await bcrypt.compare(credentials.password, user.password);
              if (!isValid) {
                throw new Error('Invalid password');
              }
            }
          }

          return {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw new Error(error.message || 'Authentication failed');
        }
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

        const { ethers } = await import('ethers');
        try {
          const recoveredAddress = ethers.verifyMessage(credentials.message, credentials.signature);
          if (recoveredAddress.toLowerCase() !== credentials.address.toLowerCase()) {
            throw new Error('Invalid signature');
          }
        } catch (e) {
          throw new Error('Signature verification failed');
        }

        try {
          // Find or create wallet user in DB
          let user = await prisma.user.findUnique({
            where: { walletAddress: credentials.address.toLowerCase() },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                email: `${credentials.address.slice(0, 10)}@wallet.prediktit.com`,
                username: `wallet_${credentials.address.slice(2, 10)}`,
                walletAddress: credentials.address.toLowerCase(),
                playBalance: 10000,
              },
            });
          }

          return {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            walletAddress: user.walletAddress,
          };
        } catch (error) {
          console.error('Wallet auth error:', error);
          throw new Error('Wallet authentication failed');
        }
      },
    }),

    // Google OAuth (add env vars to enable)
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
