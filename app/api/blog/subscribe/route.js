import { Resend } from "resend";
import crypto from "crypto";
import dbConnect from "@/utils/db";
import Subscriber from "@/utils/models/Subscriber";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY || "re_123456789");

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await Subscriber.findOne({ email: cleanEmail });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (existing) {
      if (existing.verified) {
        return NextResponse.json({ error: "This email is already subscribed to the list" }, { status: 400 });
      }

      // Re-send verification link
      const token = existing.verificationToken || crypto.randomBytes(32).toString("hex");
      if (!existing.verificationToken) {
        existing.verificationToken = token;
        await existing.save();
      }

      const confirmUrl = `${baseUrl}/api/blog/subscribe/confirm?token=${token}`;

      await resend.emails.send({
        from: "CODIAC Tech Journal <newsletter@codiac.online>",
        to: [cleanEmail],
        subject: "Confirm your subscription - CODIAC Tech Journal",
        html: `
          <div style="font-family: monospace; background-color: #0a0a0a; color: #fff; padding: 40px; border: 1px solid #333; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #adff2f; border-bottom: 1px solid #333; padding-bottom: 20px; font-weight: 800; letter-spacing: -1px; text-transform: uppercase; margin-top: 0;">CODIAC // CONFIRM_SUBSCRIPTION</h2>
            <p style="color: #ccc; line-height: 1.6; font-size: 14px;">Hi there,</p>
            <p style="color: #ccc; line-height: 1.6; font-size: 14px;">Please confirm your subscription to the CODIAC Tech Journal to receive high-density engineering writeups:</p>
            <div style="margin: 32px 0;">
              <a href="${confirmUrl}" style="background-color: #adff2f; color: #0a0a0a; text-decoration: none; padding: 12px 24px; font-weight: bold; font-size: 14px; border-radius: 0; display: inline-block; border: 1px solid #adff2f;">CONFIRM_SUBSCRIPTION</a>
            </div>
            <p style="color: #555; font-size: 12px; margin-top: 40px; border-top: 1px solid #222; padding-top: 20px;">
              If you did not request this, you can ignore this email safely.<br/>
              SYS_STATUS: CONFIRMATION_RE_DISPATCHED
            </p>
          </div>
        `,
      });

      return NextResponse.json({ success: true, message: "A confirmation link has been sent to your inbox." }, { status: 200 });
    }

    // Register new subscriber
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const subscriber = new Subscriber({
      email: cleanEmail,
      verified: false,
      verificationToken,
    });

    await subscriber.save();

    const confirmUrl = `${baseUrl}/api/blog/subscribe/confirm?token=${verificationToken}`;

    await resend.emails.send({
      from: "CODIAC Tech Journal <newsletter@codiac.online>",
      to: [cleanEmail],
      subject: "Confirm your subscription - CODIAC Tech Journal",
      html: `
        <div style="font-family: monospace; background-color: #0a0a0a; color: #fff; padding: 40px; border: 1px solid #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #adff2f; border-bottom: 1px solid #333; padding-bottom: 20px; font-weight: 800; letter-spacing: -1px; text-transform: uppercase; margin-top: 0;">CODIAC // CONFIRM_SUBSCRIPTION</h2>
          <p style="color: #ccc; line-height: 1.6; font-size: 14px;">Hi there,</p>
          <p style="color: #ccc; line-height: 1.6; font-size: 14px;">Thanks for signing up to receive technical journals, architecture guides, and articles from Musa Musa Kannike. Click the link below to verify your email and confirm your subscription:</p>
          <div style="margin: 32px 0;">
            <a href="${confirmUrl}" style="background-color: #adff2f; color: #0a0a0a; text-decoration: none; padding: 12px 24px; font-weight: bold; font-size: 14px; border-radius: 0; display: inline-block; border: 1px solid #adff2f;">CONFIRM_SUBSCRIPTION</a>
          </div>
          <p style="color: #555; font-size: 12px; margin-top: 40px; border-top: 1px solid #222; padding-top: 20px;">
            If you did not request this, you can ignore this email safely.<br/>
            SYS_STATUS: CONFIRMATION_DISPATCHED
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "Subscription requested! Please check your email to confirm." }, { status: 201 });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ error: "Failed to record subscription" }, { status: 500 });
  }
}
