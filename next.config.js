module.exports = {
  experimental: {
    concurrentFeatures: true,
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/page",
        destination: "/",
        permanent: true,
      },
      {
        source: "/page/index",
        destination: "/",
        permanent: true,
      },
    ];
  },
  // images: {
  //   domains: ["i.pinimg.com"],
  // },
  async rewrites() {
    return {
      // After checking all Next.js pages (including dynamic routes)
      // and static files we proxy any other requests
      fallback: [
        {
          source: "/:api*",
          destination: `${process.env.BASE_URL}/:api*`,
        },
      ],
    };
  },
};
