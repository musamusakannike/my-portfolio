import bcrypt from "bcryptjs";
import dbConnect from "@/utils/db";
import User from "@/utils/models/User";
import { signToken, isAdminEmail } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || user.authMethod !== "email") {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
    }

    // Compare password hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
    }

    // Check email verification status
    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "Please verify your email address. We sent a verification link to your inbox." },
        { status: 401 }
      );
    }

    const isAdmin = isAdminEmail(user.email);

    // Create session JWT
    const token = signToken({
      userId: user._id,
      email: user.email,
      name: user.name,
      isAdmin,
    });

    const isProd = process.env.NODE_ENV === "production";
    
    // Set HTTPOnly cookie
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

    response.headers.append(
      "Set-Cookie",
      `auth_token=${token}; Path=/; HttpOnly; ${
        isProd ? "Secure;" : ""
      } SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}` // 7 days
    );

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
