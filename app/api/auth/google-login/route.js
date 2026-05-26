import dbConnect from "@/utils/db";
import User from "@/utils/models/User";
import { verifyFirebaseIdToken, signToken, isAdminEmail } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: "Missing Firebase ID Token" }, { status: 400 });
    }

    // Verify token using our lightweight verifier
    const decodedToken = await verifyFirebaseIdToken(idToken);

    if (!decodedToken) {
      return NextResponse.json({ error: "Invalid ID Token signature or claims" }, { status: 401 });
    }

    const { email, name, picture } = decodedToken;

    if (!email) {
      return NextResponse.json({ error: "Email is missing from ID Token claims" }, { status: 400 });
    }

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() });
    const isAdmin = isAdminEmail(email);

    if (!user) {
      user = new User({
        name: name || "Google User",
        email: email.toLowerCase(),
        authMethod: "google",
        emailVerified: true,
        isAdmin,
      });
      await user.save();
    } else {
      // If user exists, ensure email is verified since Google verifies it
      let wasModified = false;
      if (!user.emailVerified) {
        user.emailVerified = true;
        wasModified = true;
      }
      // If native user signs in with Google, we can link/authenticate them seamlessly
      if (user.authMethod !== "google" && user.authMethod !== "email") {
        user.authMethod = "google";
        wasModified = true;
      }
      if (wasModified) {
        await user.save();
      }
    }

    // Sign session JWT
    const token = signToken({
      userId: user._id,
      email: user.email,
      name: user.name,
      isAdmin,
    });

    const isProd = process.env.NODE_ENV === "production";

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin,
        },
      },
      { status: 200 }
    );

    // Set cookie
    response.headers.append(
      "Set-Cookie",
      `auth_token=${token}; Path=/; HttpOnly; ${
        isProd ? "Secure;" : ""
      } SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}` // 7 days
    );

    return response;
  } catch (error) {
    console.error("Google login API error:", error);
    return NextResponse.json({ error: "Google authentication failed" }, { status: 500 });
  }
}
