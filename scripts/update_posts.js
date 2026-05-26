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

function decodeHtmlEntities(str) {
  return str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function detectLanguage(code) {
  const decoded = decodeHtmlEntities(code);
  const trimmed = decoded.trim();
  
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      JSON.parse(trimmed);
      return "json";
    } catch (e) {}
  }
  
  if (/^\s*(npm|yarn|pnpm|npx|gem|pod|git|cd|mkdir|touch|node)\s/i.test(trimmed) || trimmed.startsWith("#")) {
    return "bash";
  }
  
  if (trimmed.includes("use_react_native!") || trimmed.includes("pod ")) {
    return "ruby";
  }
  
  if (trimmed.includes("project.ext.react") || trimmed.includes("dependencies {")) {
    return "groovy";
  }
  
  if (trimmed.includes("<") && trimmed.includes(">") && (trimmed.includes("/>") || trimmed.includes("</"))) {
    if (trimmed.includes(":") || trimmed.includes("interface ") || trimmed.includes("type ")) {
      return "tsx";
    }
    return "jsx";
  }
  
  if (trimmed.includes(":") && (trimmed.includes("type ") || trimmed.includes("interface ") || trimmed.includes("as ") || trimmed.includes("public ") || trimmed.includes("private "))) {
    return "typescript";
  }
  
  if (trimmed.includes("import ") || trimmed.includes("const ") || trimmed.includes("let ") || trimmed.includes("function") || trimmed.includes("=>") || trimmed.includes("console.log")) {
    return "javascript";
  }
  
  return "javascript"; // fallback default
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB!");
  
  const posts = await Post.find({});
  console.log(`Found ${posts.length} posts to check.\n`);
  
  let totalUpdated = 0;
  
  for (const post of posts) {
    const originalContent = post.content || "";
    if (!originalContent.includes("<pre")) {
      console.log(`[SKIP] "${post.title}" - no <pre> elements found.`);
      continue;
    }
    
    console.log(`[PROCESS] "${post.title}"...`);
    
    // Pattern to find all <pre><code>...</code></pre> blocks (ignoring any existing class)
    const regex = /<pre>\s*<code>([\s\S]*?)<\/code>\s*<\/pre>/gi;
    let match;
    let newContent = originalContent;
    let matchCount = 0;
    
    // We use a temp replacement strategy to safely replace each block with its detected language
    const replacements = [];
    
    while ((match = regex.exec(originalContent)) !== null) {
      matchCount++;
      const fullMatch = match[0];
      const codeContent = match[1];
      const lang = detectLanguage(codeContent);
      
      console.log(`  -> Block ${matchCount}: detected language: "${lang}"`);
      
      replacements.push({
        search: fullMatch,
        replace: `<pre><code class="language-${lang}">${codeContent}</code></pre>`
      });
    }
    
    if (replacements.length > 0) {
      for (const rep of replacements) {
        newContent = newContent.replace(rep.search, rep.replace);
      }
      
      post.content = newContent;
      await post.save();
      console.log(`  [SUCCESS] Updated ${replacements.length} code block(s) for "${post.title}".`);
      totalUpdated++;
    } else {
      console.log(`  [NO CHANGE] Code blocks already formatted or no matches found.`);
    }
    console.log("");
  }
  
  console.log(`Done! Total posts updated: ${totalUpdated}`);
  await mongoose.disconnect();
}

run().catch(console.error);
