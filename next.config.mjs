/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
      {
        source: '/ws/:path*',
        destination: 'http://localhost:8081/ws/:path*',
      },
      {
        source: '/nws/:path*',
        destination: 'http://localhost:4000/nws/:path*',
      },
      {
        source: '/socket.io/:path*',
        destination: 'http://localhost:4000/socket.io/:path*',
      },
    ]
  },
};


export default config;
