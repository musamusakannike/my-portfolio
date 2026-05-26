import { Resend } from "resend";
import dbConnect from "@/utils/db";
import Subscriber from "@/utils/models/Subscriber";
import { getSessionUser } from "@/utils/auth";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY || "re_123456789");

export async function GET(req) {
  try {
    await dbConnect();
    const user = getSessionUser(req);

    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Access Denied: Admin authorization required" }, { status: 403 });
    }

    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, subscribers }, { status: 200 });
  } catch (error) {
    console.error("Subscribers fetch error:", error);
    return NextResponse.json({ error: "Failed to retrieve subscribers" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const user = getSessionUser(req);

    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Access Denied: Admin authorization required" }, { status: 403 });
    }

    const { subject, htmlContent } = await req.json();

    if (!subject || !htmlContent) {
      return NextResponse.json({ error: "Missing newsletter subject or content body" }, { status: 400 });
    }

    // Fetch verified subscribers
    const subscribers = await Subscriber.find({ verified: true });

    if (subscribers.length === 0) {
      return NextResponse.json({ success: true, sentCount: 0, message: "Mailing list is currently empty" }, { status: 200 });
    }

    // Batch prepare emails for Resend
    const batchData = subscribers.map((sub) => ({
      from: "CODIAC Tech Journal <newsletter@codiac.online>",
      to: sub.email,
      subject: subject,
      html: `
        <div style="font-family: monospace; background-color: #0a0a0a; color: #fff; padding: 40px; border: 1px solid #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #adff2f; border-bottom: 1px solid #333; padding-bottom: 20px; font-weight: 800; letter-spacing: -1px; text-transform: uppercase; margin-top: 0;">CODIAC // NEWSLETTER</h2>
          <div style="color: #ccc; line-height: 1.7; font-size: 14px; margin: 24px 0;">
            ${htmlContent}
          </div>
          <p style="color: #444; font-size: 11px; margin-top: 48px; border-top: 1px solid #222; padding-top: 20px;">
            You are receiving this because you subscribed to Musa's tech journal updates.<br/>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/blog/unsubscribe?email=${encodeURIComponent(sub.email)}" style="color: #adff2f; text-decoration: underline;">UNSUBSCRIBE</a>
          </p>
        </div>
      `,
    }));

    // Split batches to respect Resend limits if needed (max 100 per batch call)
    const batchSize = 100;
    let sentCount = 0;
    
    for (let i = 0; i < batchData.length; i += batchSize) {
      const chunk = batchData.slice(i, i + batchSize);
      await resend.batch.send(chunk);
      sentCount += chunk.length;
    }

    return NextResponse.json({ success: true, sentCount, message: `Newsletter campaign dispatched to ${sentCount} subscribers` }, { status: 200 });
  } catch (error) {
    console.error("Newsletter send error:", error);
    return NextResponse.json({ error: error.message || "Failed to dispatch newsletter campaign" }, { status: 500 });
  }
}
