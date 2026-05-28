import BlogHub from "./BlogHub";

export const metadata = {
  metadataBase: new URL("https://codiac.online"),
  title: "Blog | Musa Musa Kannike - Engineering Insights",
  description: "Technical articles, engineering insights, and deep dives into fullstack development, AI systems, and system design by Musa Musa Kannike.",
  keywords: "software engineering, fullstack development, AI, system design, React, Node.js, TypeScript, JavaScript",
  openGraph: {
    title: "Blog | Musa Musa Kannike - Engineering Insights",
    description: "Technical articles, engineering insights, and deep dives into fullstack development, AI systems, and system design.",
    url: "https://codiac.online/blog",
    siteName: "Musa Musa Kannike",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://codiac.online/og-blog.png",
        width: 1200,
        height: 630,
        alt: "Musa Musa Kannike's Engineering Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Musa Musa Kannike - Engineering Insights",
    description: "Technical articles, engineering insights, and deep dives into fullstack development, AI systems, and system design.",
    images: ["https://codiac.online/og-blog.png"],
    creator: "@musamusakannike",
  },
  alternates: {
    canonical: "https://codiac.online/blog",
  },
};

export default function BlogPage() {
  return <BlogHub />;
}
