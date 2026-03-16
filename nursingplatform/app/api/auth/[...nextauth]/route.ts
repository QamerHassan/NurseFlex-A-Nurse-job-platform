import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

const handler = NextAuth({
    // Prisma adapter stores Google users in MongoDB automatically
    adapter: PrismaAdapter(prisma),

    providers: [
        GoogleProvider({
            clientId: (process.env.GOOGLE_CLIENT_ID || '').replace(/["']/g, '').trim(),
            clientSecret: (process.env.GOOGLE_CLIENT_SECRET || '').replace(/["']/g, '').trim(),
            allowDangerousEmailAccountLinking: true,
            authorization: {
              params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code"
              }
            }
        }),
        CredentialsProvider({
            id: "google-one-tap",
            name: "Google One Tap",
            credentials: {
                credential: { label: "Credential", type: "text" },
            },
            async authorize(credentials) {
                const token = credentials?.credential;
                if (!token) return null;

                try {
                    // 1. Verify token with Google API
                    console.log("🔍 Google One Tap: Verifying token...");
                    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
                    const googleUser = await response.json();

                    if (googleUser.error) {
                        console.error("❌ Google One Tap: Tokeninfo Error", googleUser.error_description || googleUser.error);
                        return null;
                    }

                    const clientId = (process.env.GOOGLE_CLIENT_ID || '').replace(/"/g, '').trim();
                    const isValidAud = googleUser.aud === clientId || googleUser.azp === clientId;

                    if (!googleUser.email || !isValidAud) {
                        console.error("❌ Google One Tap: Validation Failed", {
                            email: googleUser.email,
                            aud: googleUser.aud,
                            azp: googleUser.azp,
                            expected: clientId
                        });
                        return null;
                    }

                    // 2. Find or Create User
                    let dbUser = await prisma.user.findUnique({
                        where: { email: googleUser.email },
                    });

                    if (!dbUser) {
                        console.log("✨ Google One Tap: Creating new user:", googleUser.email);
                        try {
                            dbUser = await prisma.user.create({
                                data: {
                                    email: googleUser.email,
                                    name: googleUser.name || googleUser.email.split('@')[0],
                                    role: "NURSE",
                                    status: "APPROVED", 
                                }
                            });

                            await prisma.profile.create({
                                data: {
                                    userId: dbUser.id,
                                    name: googleUser.name || googleUser.email.split('@')[0],
                                }
                            });
                        } catch (dbError) {
                            console.error("❌ Google One Tap: DB Error during user creation", dbError);
                            return null;
                        }
                    }

                    return {
                        id: dbUser.id,
                        email: dbUser.email,
                        name: dbUser.name,
                        role: dbUser.role,
                        status: dbUser.status,
                    };
                } catch (error) {
                    console.error("❌ Google One Tap Authorize Error:", error);
                    return null;
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,

    // Use "jwt" so we can embed role/status into the token
    session: {
        strategy: "jwt",
    },

    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google" || account?.provider === "google-one-tap") {
                try {
                    if (!user.email) return false;
                    const dbUser = await prisma.user.findUnique({
                        where: { email: user.email },
                        select: { status: true },
                    });
                    if (dbUser?.status === "REJECTED") return false;
                } catch (e) {
                    console.error("Sign-in validation error:", e);
                }
            }
            return true;
        },

        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : baseUrl;
        },

        async jwt({ token, user, account }) {
            if (account && user) {
                token.id = user.id;
                // @ts-ignore
                token.role = user.role || "NURSE";
                // @ts-ignore
                token.status = user.status || "PENDING";
            }

            if (token.id) {
                try {
                    const dbUser = await prisma.user.findUnique({
                        where: { id: token.id as string },
                        select: { status: true, role: true }
                    });
                    if (dbUser) {
                        token.status = dbUser.status;
                        token.role = dbUser.role;
                    }
                } catch (e) {
                    console.error("JWT sync error:", e);
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (session?.user) {
                // @ts-ignore
                session.user.id = token.id;
                // @ts-ignore
                session.user.role = token.role;
                // @ts-ignore
                session.user.status = token.status;
            }
            return session;
        },
    },

    events: {
        async createUser({ user }) {
            try {
                const existingProfile = await prisma.profile.findUnique({
                    where: { userId: user.id }
                });
                if (!existingProfile) {
                    await prisma.profile.create({
                        data: {
                            userId: user.id,
                            name: user.name || user.email?.split('@')[0] || "User",
                        }
                    });
                }
            } catch (e) {
                console.error("Failed to create auto-profile:", e);
            }
        },
    },

    pages: {
        signIn: "/auth/login",
        error: "/auth/login",
    },
    debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
