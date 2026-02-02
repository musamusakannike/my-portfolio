/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "pub-080732c6fb61453c92062218797bf9df.r2.dev",
            },
            {
                protocol: "https",
                hostname: "i.ibb.co",
            },
        ],
    },
};

export default nextConfig;
