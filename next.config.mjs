/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  webpack(config) {
    config.module.rules.push({
      rules: [
        {
          test: /\.css$/,
          enforce: "pre",
          use: ["@tailwindcss/turbopack"],
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
