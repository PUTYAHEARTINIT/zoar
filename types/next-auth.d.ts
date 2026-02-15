import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "MEMBER" | "APPLICANT";
      membershipTier: "MEMBER_SELLER" | "VERIFIED_COLLECTOR" | "ELITE_CURATOR" | null;
      membershipStatus: "ACTIVE" | "PENDING" | "SUSPENDED" | "REVOKED";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    membershipTier: string | null;
    membershipStatus: string;
  }
}
