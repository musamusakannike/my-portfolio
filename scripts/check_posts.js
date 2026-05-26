const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

// Read and parse .env manually
const envPath = path.join(__dirname, "../.env");
let MONGODB_URI = "";

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  const lines = envContent.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const parts = trimmed.split("=");
      if (parts[0] === "MONGODB_URI") {
        MONGODB_URI = parts.slice(1).join("=").trim();
      }
    }
  }
}

if (!MONGODB_URI) {
  console.error("MONGODB_URI not found in .env file");
  process.exit(1);
}

const PostSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    slug: String,
  },
  { collection: "posts" }
);

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB!");
  
  const posts = await Post.find({});
  console.log(`Found ${posts.length} posts.`);
  
  for (const post of posts) {
    console.log(`-----------------------------------`);
    console.log(`Title: ${post.title}`);
    console.log(`Slug: ${post.slug}`);
    
    const content = post.content || "";
    const hasPre = content.includes("<pre");
    const hasFenced = content.includes("```");
    console.log(`Has <pre: ${hasPre}, Has \`\`\`: ${hasFenced}`);
    
    if (hasPre) {
      console.log("Found HTML pre/code elements. Snippet:");
      const matches = content.match(/<pre[^>]*>[\s\S]*?<\/pre>/g);
      if (matches) {
        matches.forEach((m, idx) => {
          console.log(`Match ${idx + 1}:`, m.slice(0, 300));
        });
      }
    }
  }
  
  await mongoose.disconnect();
}

run().catch(console.error);
