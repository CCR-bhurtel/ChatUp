/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    // Disable webpack's asset processing for images and fonts
    if (!isServer) {
      config.module.rules.forEach((rule) => {
        if (
          rule.test &&
          (rule.test.toString().includes("png") ||
            rule.test.toString().includes("jpg") ||
            rule.test.toString().includes("svg") ||
            rule.test.toString().includes("gif") ||
            rule.test.toString().includes("woff") ||
            rule.test.toString().includes("woff2") ||
            rule.test.toString().includes("ttf") ||
            rule.test.toString().includes("eot"))
        ) {
          rule.use = [
            {
              loader: "file-loader",
              options: {
                publicPath: "/_next",
                name: "static/media/[name].[hash].[ext]",
              },
            },
          ];
        }
      });
    }

    return config;
  },
};

module.exports = nextConfig;
