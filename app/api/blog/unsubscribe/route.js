import dbConnect from "@/utils/db";
import Subscriber from "@/utils/models/Subscriber";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!email) {
      return NextResponse.redirect(`${baseUrl}/blog?unsubscribed=false&error=missing_email`);
    }

    const subscriber = await Subscriber.findOneAndDelete({ email: email.toLowerCase() });

    if (!subscriber) {
      return NextResponse.redirect(`${baseUrl}/blog?unsubscribed=false&error=email_not_found`);
    }

    return NextResponse.redirect(`${baseUrl}/blog?unsubscribed=true`);
  } catch (error) {
    console.error("Unsubscribe error:", error);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseUrl}/blog?unsubscribed=false&error=server_error`);
  }
}
