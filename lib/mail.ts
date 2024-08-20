import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmationLink = `${process.env.BASE_URL}/auth/new-verification?token=${token}`;
  await resend.emails.send({
    from: 'welcome@sudhanshu.site',
    to: email,
    subject: 'Confirm you email',
    html: `<p>Click <a href="${confirmationLink}">here</a> to confirm your email.</p>`,
  });
};
