import ArticleReader from "./ArticleReader";
import dbConnect from "@/utils/db";
import Post from "@/utils/models/Post";

export async function generateMetadata({ params }) {
  const { slug } = params;
  
  try {
    await dbConnect();
    const post = await Post.findOne({ slug, published: true }).lean();
    
    if (!post) {
      return {
        title: "Post Not Found | Musa Musa Kannike",
        description: "The requested blog post could not be found.",
      };
    }
    
    const title = post.title;
    const description = post.summary;
    const url = `https://codiac.online/blog/${slug}`;
    const image = post.coverImage;
    
    return {
      metadataBase: new URL("https://codiac.online"),
      title: `${title} | Musa Musa Kannike`,
      description,
      keywords: post.tags?.join(", ") || "",
      authors: [{ name: post.author?.name || "Musa Musa Kannike" }],
      openGraph: {
        title,
        description,
        url,
        siteName: "Musa Musa Kannike",
        locale: "en_US",
        type: "article",
        publishedTime: post.createdAt?.toISOString(),
        modifiedTime: post.updatedAt?.toISOString(),
        authors: [post.author?.name || "Musa Musa Kannike"],
        tags: post.tags || [],
        images: image ? [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: image ? [image] : undefined,
        creator: "@musamusakannike",
      },
      alternates: {
        canonical: url,
      },
    };
  } catch (error) {
    return {
      title: "Blog | Musa Musa Kannike",
      description: "Technical articles and engineering insights.",
    };
  }
}

export default function BlogPostPage({ params }) {
  return <ArticleReader slug={params.slug} />;
}
