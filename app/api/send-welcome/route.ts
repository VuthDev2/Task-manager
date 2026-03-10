import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY environment variable. Please add it to your environment variables.');
  }
  return new Resend(apiKey);
};

export async function POST(req: NextRequest) {
  try {
    const { email, firstName } = await req.json();

    if (!email || !firstName) {
      return NextResponse.json({ error: 'Missing email or firstName' }, { status: 400 });
    }

    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: 'Task Manager <onboarding@resend.dev>',
      to: [email],
      subject: 'Welcome to Task Manager! Please verify your email',
      html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Welcome to Task Manager</title>
        </head>
        <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                  <!-- Header -->
                  <tr>
                    <td style="background-color:#000000;padding:32px 40px;">
                      <p style="margin:0;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;font-style:italic;text-transform:uppercase;">Task Manager</p>
                    </td>
                  </tr>
                  <!-- Body -->
                  <tr>
                    <td style="padding:40px;">
                      <h1 style="margin:0 0 8px 0;font-size:28px;font-weight:900;color:#000000;letter-spacing:-0.5px;">Welcome, ${firstName}! 👋</h1>
                      <p style="margin:0 0 24px 0;font-size:15px;color:#6b7280;line-height:1.6;">
                        Thanks for signing up. We've sent a separate verification email to <strong>${email}</strong>. 
                        Please click the link in that email to activate your account.
                      </p>
                      <div style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:28px;">
                        <p style="margin:0 0 4px 0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;">What's next?</p>
                        <ul style="margin:8px 0 0 0;padding-left:20px;color:#374151;font-size:14px;line-height:1.8;">
                          <li>Check your inbox for the verification email</li>
                          <li>Click "Confirm your email" in that email</li>
                          <li>Log in and start managing your tasks</li>
                        </ul>
                      </div>
                      <p style="margin:0;font-size:13px;color:#9ca3af;">
                        Didn't receive the verification email? Check your spam folder, or 
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/verify-email" style="color:#000000;font-weight:700;">resend it here</a>.
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background-color:#f9fafb;border-top:1px solid #f3f4f6;padding:20px 40px;">
                      <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
                        © 2025 Task Manager. You're receiving this because you created an account.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err: any) {
    console.error('Send welcome email error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
