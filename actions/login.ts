'use server';

import { signIn } from '@/auth';
import { getUserByEmail } from '@/data/user';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/token';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginSchema } from '@/schemas';
import { AuthError } from 'next-auth';
import * as z from 'zod';

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid Fields' };
  }
  const { email, password } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Email does not exist!' };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(email);
    if (verificationToken) {
      sendVerificationEmail(verificationToken.email, verificationToken.token);
      return { success: 'Confirmation email sent!' };
    }

  }

  try {
    const res = await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    if (res) {
      return { success: 'Login Successful' };
    }
    return { error: 'Login Error' };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CallbackRouteError':
          return { error: 'Invalid Credentials' };
        case 'CredentialsSignin':
          return { error: 'Invalid Credentials' };
        default:
          return { error: 'Something went wrong' };
      }
    }
    throw error;
  }
};

/**
 * TODO: If invalid credentials are entered it is giving CallbackRouteError,
 * Instead of Invalid Credentials, which should be fixed.
 * Error shows that it could because of the authorize function in "auth.config.ts" and because of jwt
 *
 */
