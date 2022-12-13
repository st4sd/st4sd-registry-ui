/*
    Copyright IBM Inc. All Rights Reserved.
    SPDX-License-Identifier: Apache-2.0

    Author: Alessandro Pomponio
*/
export function checkContainerImagesHaveTagOtherThanLatest(experiment) {
  let containerImages = experiment.metadata.registry.containerImages;

  // No container images listed = FAIL
  if (containerImages.length == 0) return false;

  for (let i = 0; i < containerImages.length; i++) {
    //
    let imageName = containerImages[i].name;
    let index = imageName.indexOf(":");

    // If the image doesn't have a tag = FAIL
    if (index == -1) return false;

    // If the image uses the latest tag = FAIL
    let tag = imageName.substring(index);
    if (tag == "latest") {
      return false;
    }
  }

  return true;
}

export function checkBasePackagesHaveCommitOrTag(experiment) {
  for (let i = 0; i < experiment.base.packages.length; i++) {
    let base_package = experiment.base.packages[i];

    // It's not a git package
    if (!("git" in base_package.source)) return false;

    // The git package does not have a key for commit or tag
    if (
      !("commit" in base_package.source.git.location) &&
      !("tag" in base_package.source.git.location)
    )
      return false;

    // The git package specifies the commit field but it's null
    if (
      "commit" in base_package.source.git.location &&
      base_package.source.git.location.commit == null
    )
      return false;

    // The git package specifies the tag field but it's null
    if (
      "tag" in base_package.source.git.location &&
      base_package.source.git.location.tag == null
    )
      return false;
  }
  return true;
}

export function getStrongVersioningScore(experiment) {
  //
  let totalScore = 1;
  let numberOfTests = 2;
  let weight = totalScore / numberOfTests;

  //
  let imagesAreTagged = checkContainerImagesHaveTagOtherThanLatest(experiment)
    ? weight
    : 0;
  let basePackagesHaveCommit = checkBasePackagesHaveCommitOrTag(experiment)
    ? weight
    : 0;

  //
  return Math.round(100 * (imagesAreTagged + basePackagesHaveCommit));
}
