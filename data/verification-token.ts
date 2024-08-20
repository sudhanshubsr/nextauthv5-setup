import { prisma } from '@/lib/db';

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const getVerificationTokenByEmail =
      await prisma.verificationToken.findFirst({
        where: { email },
      });
    return getVerificationTokenByEmail;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const getVerificationTokenByToken =
      await prisma.verificationToken.findUnique({
        where: { token },
      });
    return getVerificationTokenByToken;
  } catch (error) {
    return null;
  }
};
