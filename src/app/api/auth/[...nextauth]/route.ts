import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  callbacks: {
    async signIn({ user, account, profile }) {
      if (
        (account?.provider === "google" &&
          profile?.email &&
          (profile?.email?.includes("@umich.edu") ||
            profile?.email?.includes("mdex23testuser@gmail.com"))) ||
        profile?.email?.includes("farooq.zenkoders@gmail.com") ||
        profile?.email?.includes("aliraza@zenkoders.com")
      ) {
        return true;
      } else {
        // alert('Only umich emails are allowed.')
        return "https://organization.thisismdex.com/error?error=Only_umich_students_are_allowed_to_use_this_application";
      }
    },
    redirect() {
      //return "https://organization.thisismdex.com/signin";
      return "http://localhost:3000/signin";
    },
  },

  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
});

export { handler as GET, handler as POST };
