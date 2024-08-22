/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/ws/:path*',
        destination: 'http://localhost:8081/ws/:path*',
      },
      {
        source: '/nws/:path*',
        destination: 'http://localhost:4000/nws/:path*',
      },
    ]
  },
};


export default config;
