import dbConnect from "@/utils/db";
import SiteContent from "@/utils/models/SiteContent";
import { getSessionUser } from "@/utils/auth";
import { ensureSiteContent } from "@/utils/portfolioData";
import { getDefaultContent, PORTFOLIO_VARIANTS } from "@/utils/siteContentDefaults";
import { NextResponse } from "next/server";

function requireAdmin(req) {
  const user = getSessionUser(req);
  if (!user || !user.isAdmin) return null;
  return user;
}

export async function GET(req) {
  try {
    await dbConnect();
    const user = requireAdmin(req);
    if (!user) {
      return NextResponse.json({ error: "Access Denied: Admin authorization required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const variant = searchParams.get("variant") || "main";

    if (!PORTFOLIO_VARIANTS.includes(variant)) {
      return NextResponse.json({ error: "Invalid portfolio variant" }, { status: 400 });
    }

    const content = await ensureSiteContent(variant);
    return NextResponse.json({ success: true, content }, { status: 200 });
  } catch (error) {
    console.error("Get site content error:", error);
    return NextResponse.json({ error: "Failed to retrieve site content" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const user = requireAdmin(req);
    if (!user) {
      return NextResponse.json({ error: "Access Denied: Admin authorization required" }, { status: 403 });
    }

    const body = await req.json();
    const variant = body.variant;

    if (!PORTFOLIO_VARIANTS.includes(variant)) {
      return NextResponse.json({ error: "Invalid portfolio variant" }, { status: 400 });
    }

    const defaults = getDefaultContent(variant);
    const update = {
      hero: body.hero ?? defaults.hero,
      about: body.about ?? defaults.about,
      experiences: body.experiences ?? defaults.experiences,
      testimonials: body.testimonials ?? defaults.testimonials,
      contact: body.contact ?? defaults.contact,
      footer: body.footer ?? defaults.footer,
      cvUrl: body.cvUrl ?? defaults.cvUrl,
    };

    const content = await SiteContent.findOneAndUpdate(
      { variant },
      { $set: update, $setOnInsert: { variant } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({ success: true, content }, { status: 200 });
  } catch (error) {
    console.error("Update site content error:", error);
    return NextResponse.json({ error: error.message || "Failed to update site content" }, { status: 500 });
  }
}
