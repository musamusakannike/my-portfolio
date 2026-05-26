import dbConnect from "@/utils/db";
import Subscriber from "@/utils/models/Subscriber";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!token) {
      return NextResponse.redirect(`${baseUrl}/blog?subscribed=false&error=missing_token`);
    }

    const subscriber = await Subscriber.findOne({ verificationToken: token });

    if (!subscriber) {
      return NextResponse.redirect(`${baseUrl}/blog?subscribed=false&error=token_invalid_or_expired`);
    }

    subscriber.verified = true;
    subscriber.verificationToken = null;
    await subscriber.save();

    return NextResponse.redirect(`${baseUrl}/blog?subscribed=true`);
  } catch (error) {
    console.error("Subscription confirmation error:", error);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseUrl}/blog?subscribed=false&error=server_error`);
  }
}
