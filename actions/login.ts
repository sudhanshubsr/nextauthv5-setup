'use server';

import { signIn } from '@/auth';
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
  try {
    const res = await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    if(res){
        return {success: 'Login Successful'}
    }
    return {error: 'Login Error'}
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
