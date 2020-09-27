require("dotenv").config();
const lessToJS = require("less-vars-to-js");
const fs = require("fs");
const path = require("path");
const withLess = require("@zeit/next-less");
const withCSS = require("@zeit/next-css");
const withPlugins = require("next-compose-plugins");
const Dotenv = require("dotenv-webpack");

// Where your antd-custom.less file lives
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, "./styles/antd-custom.less"), "utf8")
);

const nextConfig = {
  env: {},
  distDir: ".next",
};

const plugins = [
  withCSS({
    cssModules: true,
  }),
  withLess({
    lessLoaderOptions: {
      javascriptEnabled: true,
      modifyVars: themeVariables,
    },
    webpack: (config, { isServer }) => {
      config.plugins = config.plugins || [];

      config.plugins = [
        ...config.plugins,

        // Read the .env file
        new Dotenv({
          path: path.join(__dirname, "env/.env"),
          systemvars: true,
        }),
      ];
      if (isServer) {
        const antStyles = /antd\/.*?\/style.*?/;
        const origExternals = [...config.externals];
        config.externals = [
          (context, request, callback) => {
            if (request.match(antStyles)) return callback();
            if (typeof origExternals[0] === "function") {
              origExternals[0](context, request, callback);
            } else {
              callback();
            }
          },
          ...(typeof origExternals[0] === "function" ? [] : origExternals),
        ];

        config.module.rules.unshift({
          test: antStyles,
          use: "null-loader",
        });
      }

      // config.module.rules.push({
      //   test: /\.css$/,
      //   loader: ["css-loader"],
      // });
      return config;
    },
  }),
];
module.exports = withPlugins(plugins, nextConfig);

// );
