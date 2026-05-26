import dbConnect from "@/utils/db";
import Post from "@/utils/models/Post";
import { getSessionUser } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    const user = getSessionUser(req);

    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Access Denied: Admin authorization required" }, { status: 403 });
    }

    const posts = await Post.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, posts }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve posts" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const user = getSessionUser(req);

    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Access Denied: Admin authorization required" }, { status: 403 });
    }

    const body = await req.json();
    const { title, slug, content, summary, category, tags, coverImage, published, contentUpgrade } = body;

    if (!title || !slug || !content || !summary || !coverImage) {
      return NextResponse.json({ error: "Missing required post parameters" }, { status: 400 });
    }

    // Slug check and sanitization
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
    const existingPost = await Post.findOne({ slug: cleanSlug });
    if (existingPost) {
      return NextResponse.json({ error: "Slug already exists. Choose a unique title." }, { status: 400 });
    }

    const post = new Post({
      title,
      slug: cleanSlug,
      content,
      summary,
      category: category || "General",
      tags: tags || [],
      coverImage,
      published: published || false,
      contentUpgrade: contentUpgrade || { title: "", description: "", fileUrl: "" },
      author: {
        name: user.name || "Musa Musa Kannike",
        avatar: "",
      },
    });

    await post.save();
    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json({ error: error.message || "Failed to create post" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const user = getSessionUser(req);

    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Access Denied: Admin authorization required" }, { status: 403 });
    }

    const body = await req.json();
    const { id, title, slug, content, summary, category, tags, coverImage, published, contentUpgrade } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing post ID parameter" }, { status: 400 });
    }

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Post record not found" }, { status: 404 });
    }

    if (slug && slug !== post.slug) {
      const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
      const existingSlug = await Post.findOne({ slug: cleanSlug });
      if (existingSlug && existingSlug._id.toString() !== id) {
        return NextResponse.json({ error: "Slug already in use by another article" }, { status: 400 });
      }
      post.slug = cleanSlug;
    }

    if (title) post.title = title;
    if (content) post.content = content;
    if (summary) post.summary = summary;
    if (category) post.category = category;
    if (tags) post.tags = tags;
    if (coverImage) post.coverImage = coverImage;
    if (published !== undefined) post.published = published;
    if (contentUpgrade) post.contentUpgrade = contentUpgrade;

    await post.save();
    return NextResponse.json({ success: true, post }, { status: 200 });
  } catch (error) {
    console.error("Update post error:", error);
    return NextResponse.json({ error: error.message || "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const user = getSessionUser(req);

    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Access Denied: Admin authorization required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing post ID parameter" }, { status: 400 });
    }

    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return NextResponse.json({ error: "Post record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Post deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
