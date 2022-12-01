/*
    Copyright IBM Inc. All Rights Reserved.
    SPDX-License-Identifier: Apache-2.0

    Author: Alessandro Pomponio
*/
export function checkExperimentIsContributed(experiment) {
  let packages = experiment.base.packages;
  for (let i = 0; i < packages.length; i++) {
    if (
      !("git" in packages[i].source) ||
      !packages[i].source.git.location.url.startsWith(
        "https://github.com/st4sd/"
      )
    )
      return false;
  }

  return true;
}
