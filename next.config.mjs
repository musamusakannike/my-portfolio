/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "pub-d43ebce5cde74b3f978c924bb8c45dfa.r2.dev",
            },
            {
                protocol: "https",
                hostname: "i.ibb.co",
            },
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
