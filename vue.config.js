/*
    Copyright IBM Inc. All Rights Reserved.
    SPDX-License-Identifier: Apache-2.0

    Author: Alessandro Pomponio
*/
const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? "/registry-ui/" : "/",
  devServer: {
    server: "https",
    proxy: {
      "^/registry-ui/backend": {
        target: "http://0.0.0.0:8085",
        pathRewrite: { "^/registry-ui/backend/": "/" },
      },
    },
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        process: "process/browser",
      }),
    ],
  },
  //Properly declares the carbon web components in Vue 3
  chainWebpack: (config) => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => {
        return {
          ...options,
          compilerOptions: {
            isCustomElement: (tag) =>
              tag.includes("bx-") || tag.includes("dds-"),
          },
        };
      });
  },
});
