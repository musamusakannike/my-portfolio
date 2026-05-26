import dbConnect from "@/utils/db";
import Category from "@/utils/models/Category";
import { getSessionUser } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    const user = getSessionUser(req);

    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Access Denied: Admin authorization required" }, { status: 403 });
    }

    const categories = await Category.find().sort({ name: 1 });
    return NextResponse.json({ success: true, categories }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve categories" }, { status: 500 });
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
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const normalizedName = name.trim().toUpperCase();

    if (!normalizedName) {
      return NextResponse.json({ error: "Category name cannot be empty" }, { status: 400 });
    }

    const existingCategory = await Category.findOne({ name: normalizedName });
    if (existingCategory) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 });
    }

    const category = new Category({
      name: normalizedName,
    });

    await category.save();
    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json({ error: error.message || "Failed to create category" }, { status: 500 });
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
      return NextResponse.json({ error: "Missing category ID parameter" }, { status: 400 });
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return NextResponse.json({ error: "Category record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Category deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
