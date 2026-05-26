import dbConnect from "@/utils/db";
import Category from "@/utils/models/Category";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    
    let categories = await Category.find().sort({ name: 1 });
    
    // Auto-seed default categories if database collection is empty
    if (categories.length === 0) {
      const defaultCategories = ["FRONTEND", "BACKEND", "AI SYSTEMS", "SYSTEM DESIGN"];
      await Category.insertMany(defaultCategories.map(name => ({ name })));
      categories = await Category.find().sort({ name: 1 });
    }
    
    return NextResponse.json({ success: true, categories }, { status: 200 });
  } catch (error) {
    console.error("Public Categories Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
