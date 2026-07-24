import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSessionUser } from "@/utils/auth";
import { NextResponse } from "next/server";

// Initialize S3-compatible S3Client for Cloudflare R2
const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT || "https://placeholder-endpoint.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "placeholder_id",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "placeholder_secret",
  },
});

export async function POST(req) {
  try {
    const user = getSessionUser(req);

    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Access Denied: Admin authorization required" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const folderInput = formData.get("folder");

    if (!file) {
      return NextResponse.json({ error: "No file was attached to the request" }, { status: 400 });
    }

    // Convert file web stream to Node Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Restrict destination to a known set of folders to avoid arbitrary keys
    const allowedFolders = ["blog", "projects", "cv"];
    const folder = allowedFolders.includes(folderInput) ? folderInput : "blog";

    // Sanitize and structure R2 asset storage location
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `${folder}/${timestamp}_${sanitizedFilename}`;

    const bucketName = process.env.R2_BUCKET_NAME || "portfolio-bucket";

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    await s3.send(command);

    // Construct public Cloudflare R2 bucket link
    const publicUrlBase = process.env.R2_PUBLIC_URL || "https://pub-080732c6fb61453c92062218797bf9df.r2.dev";
    const fileUrl = `${publicUrlBase}/${key}`;

    return NextResponse.json({ success: true, url: fileUrl }, { status: 200 });
  } catch (error) {
    console.error("R2 Upload Error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file to R2 bucket" }, { status: 500 });
  }
}
