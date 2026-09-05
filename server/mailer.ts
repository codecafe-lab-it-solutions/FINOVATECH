import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: Number(process.env.EMAIL_PORT) !== 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const FROM = process.env.EMAIL_FROM || process.env.EMAIL_USER;

const WRAPPER = (title: string, bodyHtml: string) => `
  <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 480px; margin: 0 auto; color: #111827;">
    <div style="padding: 24px 0; border-bottom: 3px solid #F7931A;">
      <span style="font-weight: 800; font-size: 18px; letter-spacing: -0.02em;">FINOVATECK</span>
      <span style="color: #6B7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-top: 2px;">Mining Company &bull; Sultanate of Oman</span>
    </div>
    <div style="padding: 24px 0;">
      <h2 style="font-size: 18px; margin: 0 0 12px;">${title}</h2>
      ${bodyHtml}
    </div>
    <div style="padding: 16px 0; border-top: 1px solid #E5E7EB; color: #9CA3AF; font-size: 11px;">
      This is an automated message from FINOVATECK Mining Company. If you didn't expect this email, you can safely ignore it.
    </div>
  </div>
`;

export async function sendMail(to: string, subject: string, html: string): Promise<void> {
  await transporter.sendMail({ from: FROM, to, subject, html });
}

export async function sendWelcomeEmail(to: string, name: string, username: string): Promise<void> {
  await sendMail(
    to,
    'Your FINOVATECK investor account is ready',
    WRAPPER(
      'Welcome to FINOVATECK',
      `<p>Hi ${name},</p>
       <p>Your investor account has been created successfully. You can now log in to your dashboard to view your portfolio, wallet, and mining activity.</p>
       <div style="background: #F3F4F6; border-radius: 12px; padding: 16px; margin: 16px 0;">
         <div style="font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em;">Username</div>
         <div style="font-size: 16px; font-weight: 700; margin-bottom: 10px;">${username}</div>
         <div style="font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em;">Registered Email</div>
         <div style="font-size: 16px; font-weight: 700;">${to}</div>
       </div>
       <p style="color: #6B7280; font-size: 12px;">Keep these for your records — you'll need your username to sign in, and this email address for password resets and withdrawal confirmations.</p>`
    )
  );
}

export async function sendOtpEmail(to: string, name: string, otp: string): Promise<void> {
  await sendMail(
    to,
    'Your FINOVATECK password reset code',
    WRAPPER(
      'Password Reset Code',
      `<p>Hi ${name},</p>
       <p>Use the code below to reset your password. It expires in 10 minutes.</p>
       <div style="font-size: 32px; font-weight: 800; letter-spacing: 0.15em; background: #F3F4F6; padding: 16px; text-align: center; border-radius: 12px; margin: 16px 0;">${otp}</div>
       <p style="color: #6B7280; font-size: 12px;">If you didn't request this, you can safely ignore this email — your password won't change unless this code is used.</p>`
    )
  );
}

export async function sendWithdrawalOtpEmail(to: string, name: string, otp: string): Promise<void> {
  await sendMail(
    to,
    'Confirm your FINOVATECK withdrawal request',
    WRAPPER(
      'Withdrawal Confirmation Code',
      `<p>Hi ${name},</p>
       <p>Use the code below to confirm your BTC withdrawal request. It expires in 10 minutes.</p>
       <div style="font-size: 32px; font-weight: 800; letter-spacing: 0.15em; background: #F3F4F6; padding: 16px; text-align: center; border-radius: 12px; margin: 16px 0;">${otp}</div>
       <p style="color: #6B7280; font-size: 12px;">If you didn't request this withdrawal, do not share this code with anyone and consider changing your password.</p>`
    )
  );
}

export async function sendDepositEmail(
  to: string,
  name: string,
  amountBtc: number,
  amountUsd: number,
  network: string
): Promise<void> {
  await sendMail(
    to,
    'Deposit received — FINOVATECK',
    WRAPPER(
      'Deposit Confirmed',
      `<p>Hi ${name},</p>
       <p>A deposit has been recorded to your FINOVATECK account:</p>
       <div style="background: #F3F4F6; border-radius: 12px; padding: 16px; margin: 16px 0;">
         <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
           <span style="color: #6B7280;">Amount</span>
           <strong>${amountBtc} BTC (${'$'}${amountUsd.toLocaleString()})</strong>
         </div>
         ${network ? `<div style="display: flex; justify-content: space-between;"><span style="color: #6B7280;">Network</span><strong>${network}</strong></div>` : ''}
       </div>
       <p style="color: #6B7280; font-size: 12px;">Log in to your dashboard to view this in your transaction history.</p>`
    )
  );
}
