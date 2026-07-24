import dbConnect from "@/utils/db";
import Project from "@/utils/models/Project";
import { getSessionUser } from "@/utils/auth";
import { NextResponse } from "next/server";

function requireAdmin(req) {
  const user = getSessionUser(req);
  if (!user || !user.isAdmin) return null;
  return user;
}

const VALID_PORTFOLIOS = ["main", "backend", "frontend", "mobile"];

function sanitizePortfolios(portfolios) {
  const list = Array.isArray(portfolios) ? portfolios : [];
  const filtered = list.filter((p) => VALID_PORTFOLIOS.includes(p));
  return filtered.length ? Array.from(new Set(filtered)) : ["main"];
}

function buildProjectPayload(body) {
  return {
    title: body.title,
    category: body.category || "",
    description: body.description || "",
    tags: Array.isArray(body.tags) ? body.tags : [],
    role: body.role || "",
    image: body.image || "",
    isPrivate: !!body.isPrivate,
    isBeta: !!body.isBeta,
    portfolios: sanitizePortfolios(body.portfolios),
    order: typeof body.order === "number" ? body.order : 0,
    links: {
      website: body.links?.website || "",
      playStore: body.links?.playStore || "",
      appStore: body.links?.appStore || "",
      desktop: body.links?.desktop || "",
      github: {
        frontend: body.links?.github?.frontend || "",
        server: body.links?.github?.server || "",
        mobile: body.links?.github?.mobile || "",
      },
    },
  };
}

export async function GET(req) {
  try {
    await dbConnect();
    const user = requireAdmin(req);
    if (!user) {
      return NextResponse.json({ error: "Access Denied: Admin authorization required" }, { status: 403 });
    }

    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, projects }, { status: 200 });
  } catch (error) {
    console.error("Get projects error:", error);
    return NextResponse.json({ error: "Failed to retrieve projects" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const user = requireAdmin(req);
    if (!user) {
      return NextResponse.json({ error: "Access Denied: Admin authorization required" }, { status: 403 });
    }

    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: "Project title is required" }, { status: 400 });
    }

    const project = await Project.create(buildProjectPayload(body));
    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: error.message || "Failed to create project" }, { status: 500 });
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
    if (!body.id) {
      return NextResponse.json({ error: "Missing project ID parameter" }, { status: 400 });
    }
    if (!body.title) {
      return NextResponse.json({ error: "Project title is required" }, { status: 400 });
    }

    const project = await Project.findByIdAndUpdate(
      body.id,
      { $set: buildProjectPayload(body) },
      { new: true, runValidators: true }
    );

    if (!project) {
      return NextResponse.json({ error: "Project record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, project }, { status: 200 });
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: error.message || "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const user = requireAdmin(req);
    if (!user) {
      return NextResponse.json({ error: "Access Denied: Admin authorization required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing project ID parameter" }, { status: 400 });
    }

    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return NextResponse.json({ error: "Project record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
