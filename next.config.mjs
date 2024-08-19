/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/ws/:path*',
        destination: 'http://localhost:8081/ws/:path*',
      },
    ]
  },
};


export default config;
