import { Resend } from "resend";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dbConnect from "@/utils/db";
import User from "@/utils/models/User";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY || "re_123456789");

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Hash password & generate verification token
    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = new User({
      name,
      email,
      passwordHash,
      authMethod: "email",
      emailVerified: false,
      verificationToken,
      isAdmin: false,
    });

    await user.save();

    // Send verification email using Resend
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verifyUrl = `${baseUrl}/api/auth/verify?token=${verificationToken}`;

    await resend.emails.send({
      from: "CODIAC Tech Journal <contact@codiac.online>",
      to: [email],
      subject: "Verify your email - CODIAC Tech Journal",
      html: `
        <div style="font-family: monospace; background-color: #0a0a0a; color: #fff; padding: 40px; border: 1px solid #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #adff2f; border-bottom: 1px solid #333; padding-bottom: 20px; font-weight: 800; letter-spacing: -1px; text-transform: uppercase; margin-top: 0;">CODIAC // VERIFY_EMAIL</h2>
          <p style="color: #ccc; line-height: 1.6; font-size: 14px;">Hi ${name},</p>
          <p style="color: #ccc; line-height: 1.6; font-size: 14px;">Welcome to the CODIAC Tech Journal. Click the link below to verify your email address and activate your account:</p>
          <div style="margin: 32px 0;">
            <a href="${verifyUrl}" style="background-color: #adff2f; color: #0a0a0a; text-decoration: none; padding: 12px 24px; font-weight: bold; font-size: 14px; border-radius: 0; display: inline-block; border: 1px solid #adff2f;">VERIFY_ACCOUNT_NOW</a>
          </div>
          <p style="color: #555; font-size: 12px; margin-top: 40px; border-top: 1px solid #222; padding-top: 20px;">
            If you did not request this email, please ignore it.<br/>
            SYS_STATUS: VERIFICATION_DISPATCHED
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "Verification email sent successfully" }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: error.message || "Signup failed" }, { status: 500 });
  }
}
