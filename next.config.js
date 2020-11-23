require('dotenv').config();
const lessToJS = require('less-vars-to-js');
const fs = require('fs');
const path = require('path');
const withLess = require('@zeit/next-less');
// const withCSS = require("@zeit/next-css");
const withPlugins = require('next-compose-plugins');
const Dotenv = require('dotenv-webpack');

// Where your antd-custom.less file lives
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './styles/antd-custom.less'), 'utf8')
);

const nextConfig = {
  env: {},
  distDir: '.next',
  target: 'serverless'
};

const plugins = [
  withLess({
    lessLoaderOptions: {
      javascriptEnabled: true,
      modifyVars: themeVariables
    },
    webpack: (config, { isServer, defaultLoaders }) => {
      config.plugins = config.plugins || [];

      config.plugins = [
        ...config.plugins,

        // Read the .env file
        new Dotenv({
          path: path.join(__dirname, 'env/.env'),
          systemvars: true
        })
      ];
      if (isServer) {
        const antStyles = /antd\/.*?\/style.*?/;
        const origExternals = [...config.externals];
        config.externals = [
          (context, request, callback) => {
            if (request.match(antStyles)) return callback();
            if (typeof origExternals[0] === 'function') {
              origExternals[0](context, request, callback);
            } else {
              callback();
            }
          },
          ...(typeof origExternals[0] === 'function' ? [] : origExternals)
        ];
      }

      config.module.rules.push({
        test: /\.(html)$/,
        use: [
          defaultLoaders.babel,
          {
            loader: 'html-loader',
            options: {
              attrs: [':data-src']
            }
          }
        ]
      });
      config.module.rules.push({
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader?modules']
      });

      return config;
    }
  })
  // withCSS({
  //   cssModules: true,
  //   cssLoaderOptions: {
  //     importLoaders: 1,
  //     localIdentName: "[local]___[hash:base64:5]",
  //   },
  //   webpack: (config, options) => {
  //     config.node = {
  //       fs: "empty",
  //     };

  //     config.module.rules.push({
  //       test: /\.(html)$/,
  //       use: [
  //         options.defaultLoaders.babel,
  //         {
  //           loader: "html-loader",
  //           options: {
  //             attrs: [":data-src"],
  //           },
  //         },
  //       ],
  //     });

  //     config.plugins = config.plugins || [];

  //     return config;
  //   },
  // }),
];
module.exports = withPlugins(plugins, nextConfig);

// );
