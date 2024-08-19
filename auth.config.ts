import bcrypt from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { ZodError } from 'zod';
import { getUserByEmail } from './data/user';
import { LoginSchema } from './schemas';

export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        try {
          const validatedFields = await LoginSchema.parseAsync(credentials);
          const { email, password } = validatedFields;
          const user = await getUserByEmail(email);

          if (!user || !user.password) {
            return null;
          }
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) {
            return user;
          } else {
            return null;
          }
        } catch (error) {
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
