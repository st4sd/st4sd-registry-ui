/*
    Copyright IBM Inc. All Rights Reserved.
    SPDX-License-Identifier: Apache-2.0

    Author: Alessandro Pomponio
*/
export function getDeploymentEndpoint() {
  let publicPath =
    process.env.NODE_ENV === "production" ? "/registry-ui/" : "/";
  return window.location.origin + publicPath;
}
