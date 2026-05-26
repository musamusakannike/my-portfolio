import dbConnect from "@/utils/db";
import Post from "@/utils/models/Post";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const suggestions = searchParams.get("suggestions") === "true";
    const slug = searchParams.get("slug") || "";

    // 1. Fetch single post by slug (detailed page fetch)
    if (slug) {
      const post = await Post.findOne({ slug, published: true });
      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
      
      // Increment views asynchronously on read
      post.views += 1;
      await post.save();

      return NextResponse.json({ success: true, post }, { status: 200 });
    }

    // 2. Build search query
    const query = { published: true };

    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // 3. Auto-suggest mode: return minimal array for dropdown latency optimization
    if (suggestions) {
      const posts = await Post.find(query, "title slug category tags")
        .sort({ createdAt: -1 })
        .limit(10);
      return NextResponse.json({ success: true, suggestions: posts }, { status: 200 });
    }

    // 4. Standard listing mode
    const posts = await Post.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, posts }, { status: 200 });
  } catch (error) {
    console.error("Public Blog Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch blog items" }, { status: 500 });
  }
}
