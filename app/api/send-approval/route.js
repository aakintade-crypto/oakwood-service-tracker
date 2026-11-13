import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      studentName,
      studentEmail,
      organizationName,
      hoursLogged,
      serviceDate,
      supervisorName,
      supervisorEmail,
      description,
      verificationToken,
    } = body;

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oakwood-service-tracker.vercel.app';
    const approveUrl = `${baseUrl}/verify?token=${verificationToken}&action=approve`;
    const unapproveUrl = `${baseUrl}/verify?token=${verificationToken}&action=unapprove`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Oakwood Service Tracker <onboarding@resend.dev>',
        to: [supervisorEmail],
        reply_to: studentEmail,
        subject: `Service Hours Verification Request: ${studentName} (${hoursLogged} hrs)`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="color: #111827;">Community Service Hours Verification</h2>
            <p>Hello ${supervisorName || 'Supervisor'},</p>
            <p><strong>${studentName}</strong> (${studentEmail}) has logged community service hours listing you as their supervisor:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Organization:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${organizationName}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Hours Logged:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${hoursLogged}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Date:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${serviceDate}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Description:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${description}</td></tr>
            </table>
            <p>Please verify whether these hours are accurate:</p>
            <div style="margin: 24px 0;">
              <a href="${approveUrl}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 12px; display: inline-block;">Approve Hours</a>
              <a href="${unapproveUrl}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Unapprove Hours</a>
            </div>
          </div>
        `,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
