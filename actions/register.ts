'use server';

import { SignupSchema } from '@/schemas';
import {prisma} from '@/lib/db'
import bcrypt from 'bcryptjs';
import * as z from 'zod';
import { getUserByEmail } from '@/data/user';

export const register = async (values: z.infer<typeof SignupSchema>) => {
  const validatedFields = SignupSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid Fields' };
  }

  const {email,password,name} = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password,10)

  const existingUser = await getUserByEmail(email)
  if(existingUser){
    return {error: 'User With Email already exist!'}
  }
  await prisma.user.create({
    data:{
      name,
      email,
      password: hashedPassword
    }
  })
  // TODO: Send Verification Email

  return { success: 'User Created' };
};
