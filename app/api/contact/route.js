import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const data = await resend.emails.send({
      from: 'Portfolio Contact <contact@codiac.online>',
      to: ['musamusakannike@gmail.com'],
      subject: `New message from ${name} on your portfolio`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      reply_to: email, // Resend expects reply_to
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Resend Error:', error);
    return NextResponse.json({ error: error.message || 'Error sending email' }, { status: 500 });
  }
}
