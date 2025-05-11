/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dmfoiivoz/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/profile",
        destination: "/profile/edit",
        permanent: true,
      },
      {
        source: "/profile/edit",
        destination: "/profile/edit",
        permanent: false,
      },
    ]
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
      {
        source: "/.well-known/:path*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ]
  },
  // Добавляем обработку favicon
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/favicon.ico",
      },
    ]
  },
}

module.exports = nextConfig
