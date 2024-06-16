import type { NextAuthConfig } from "next-auth"
import bcrypt from 'bcryptjs';
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "./schemas"
import { getUserByEmail } from "./data/user"
import { ZodError } from "zod";


export default { providers: [Credentials({
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
          } else{
            return null
          }
        } catch (error) {
          return null;
        }
      }
})] } satisfies NextAuthConfig
