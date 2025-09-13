/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/summit",
        destination: "/summit/2025.2",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
