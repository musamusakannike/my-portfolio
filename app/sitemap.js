import dbConnect from "@/utils/db";
import Post from "@/utils/models/Post";

export default async function sitemap() {
  const baseUrl = "https://codiac.online";

  // Static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/ar`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  try {
    const conn = await dbConnect();
    if (!conn) {
      console.warn("Skipping dynamic sitemap post query due to missing DB connection.");
      return routes;
    }
    const posts = await Post.find({ published: true }, "slug updatedAt createdAt");

    const postUrls = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.createdAt || new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    return [...routes, ...postUrls];
  } catch (error) {
    console.error("Error generating sitemap dynamically:", error);
    return routes;
  }
}
