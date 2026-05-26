import dbConnect from "@/utils/db";
import Comment from "@/utils/models/Comment";
import { getSessionUser } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    const adminMode = searchParams.get("admin") === "true";

    if (!postId && !adminMode) {
      return NextResponse.json({ error: "Missing postId parameter" }, { status: 400 });
    }

    // Admins can see all comments for moderation checks, public users see approved only
    const query = {};
    if (postId) query.postId = postId;

    if (!adminMode) {
      query.approved = true;
    } else {
      // Admin dashboard check
      const user = getSessionUser(req);
      if (!user || !user.isAdmin) {
        return NextResponse.json({ error: "Access Denied: Admin authorization required" }, { status: 403 });
      }
    }

    const comments = await Comment.find(query).sort({ createdAt: 1 });

    if (adminMode) {
      // In admin dashboard, return flat comments with post title populate if possible, or just flat
      return NextResponse.json({ success: true, comments }, { status: 200 });
    }

    // Thread comments on the server side
    const commentMap = {};
    const threadedComments = [];

    comments.forEach((c) => {
      const commentObj = c.toObject();
      commentObj.replies = [];
      commentMap[commentObj._id.toString()] = commentObj;
    });

    comments.forEach((c) => {
      const commentObj = commentMap[c._id.toString()];
      if (c.parentId) {
        const parent = commentMap[c.parentId.toString()];
        if (parent) {
          parent.replies.push(commentObj);
        } else {
          // Fallback if parent was deleted or not approved
          threadedComments.push(commentObj);
        }
      } else {
        threadedComments.push(commentObj);
      }
    });

    // Return newest conversations at the top
    threadedComments.reverse();

    return NextResponse.json({ success: true, comments: threadedComments }, { status: 200 });
  } catch (error) {
    console.error("Comments fetch error:", error);
    return NextResponse.json({ error: "Failed to load discussions" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { postId, userName, userEmail, content, parentId } = body;

    if (!postId || !userName || !userEmail || !content) {
      return NextResponse.json({ error: "Missing required comment details" }, { status: 400 });
    }

    // Check if this is an admin commenting (auto-approve)
    const user = getSessionUser(req);
    const isCommenterAdmin = user && user.isAdmin && user.email === userEmail;

    const comment = new Comment({
      postId,
      userName,
      userEmail,
      content,
      parentId: parentId || null,
      approved: isCommenterAdmin, // Auto-approve only if written by logged in Admin
    });

    await comment.save();

    return NextResponse.json({
      success: true,
      comment,
      message: isCommenterAdmin
        ? "Comment posted successfully"
        : "Your comment is pending moderation and will appear soon.",
    }, { status: 201 });
  } catch (error) {
    console.error("Post comment error:", error);
    return NextResponse.json({ error: "Failed to publish your comment" }, { status: 500 });
  }
}

// Admin Comment Action: APPROVE / DELETE / REPLY
export async function PUT(req) {
  try {
    await dbConnect();
    const user = getSessionUser(req);

    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Access Denied: Admin authorization required" }, { status: 403 });
    }

    const { id, action } = await req.json();

    if (!id || !action) {
      return NextResponse.json({ error: "Missing comment details" }, { status: 400 });
    }

    if (action === "approve") {
      const comment = await Comment.findByIdAndUpdate(id, { approved: true }, { new: true });
      if (!comment) return NextResponse.json({ error: "Comment not found" }, { status: 404 });
      return NextResponse.json({ success: true, comment }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
  } catch (error) {
    console.error("Comment modification error:", error);
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
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
      return NextResponse.json({ error: "Missing comment identifier" }, { status: 400 });
    }

    // Delete comment
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) return NextResponse.json({ error: "Comment not found" }, { status: 404 });

    // Delete child replies of this comment
    await Comment.deleteMany({ parentId: id });

    return NextResponse.json({ success: true, message: "Comment and its replies deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Comment delete error:", error);
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}
