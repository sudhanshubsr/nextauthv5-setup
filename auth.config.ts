import bcrypt from 'bcryptjs';
import { AuthError, type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { getUserByEmail } from './data/user';
import { LoginSchema } from './schemas';

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      authorize: async (credentials) => {
        try {
          const validatedFields = await LoginSchema.parseAsync(credentials);
          const { email, password } = validatedFields;
          const user = await getUserByEmail(email);

          if (!user || !user.password) {
            throw new AuthError('CredentialsSignin');
          }
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) {
            return user;
          } else {
            throw new AuthError('CredentialsSignin');
          }
        } catch (error) {
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
