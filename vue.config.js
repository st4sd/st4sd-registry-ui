/*
    Copyright IBM Inc. All Rights Reserved.
    SPDX-License-Identifier: Apache-2.0

    Author: Alessandro Pomponio
*/
const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? "/registry-ui/" : "/",
  devServer: {
    server: "https",
    proxy: {
      "^/registry-ui/backend": {
        target: "http://localhost:8085",
        pathRewrite: { "^/registry-ui/backend/": "/" },
      },
    },
  },
});
