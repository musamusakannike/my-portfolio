import dbConnect from "@/utils/db";
import User from "@/utils/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!token) {
      return NextResponse.redirect(`${baseUrl}/blog?authAction=login&verified=false&error=missing_token`);
    }

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return NextResponse.redirect(`${baseUrl}/blog?authAction=login&verified=false&error=token_expired_or_invalid`);
    }

    user.emailVerified = true;
    user.verificationToken = null;
    await user.save();

    return NextResponse.redirect(`${baseUrl}/blog?authAction=login&verified=true`);
  } catch (error) {
    console.error("Verification error:", error);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseUrl}/blog?authAction=login&verified=false&error=server_error`);
  }
}
