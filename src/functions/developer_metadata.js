/*
    Copyright IBM Inc. All Rights Reserved.
    SPDX-License-Identifier: Apache-2.0

    Author: Alessandro Pomponio
*/
export function checkParameterisedPackageHasDescription(experiment) {
  return (
    experiment.metadata.package.description != null &&
    experiment.metadata.package.description != ""
  );
}

export function checkParameterisedPackageHasMaintainer(experiment) {
  return (
    experiment.metadata.package.maintainer != null &&
    experiment.metadata.package.maintainer != ""
  );
}

export function checkParameterisedPackageHasLicense(experiment) {
  return (
    experiment.metadata.package.license != null &&
    experiment.metadata.package.license != ""
  );
}

export function checkParameterisedPackageHasTagOtherThanLatest(experiment) {
  return (
    experiment.metadata.package.tags != null &&
    experiment.metadata.package.tags.filter((tag) => tag != "latest").length > 0
  );
}

export function checkParameterisedPackageListsInputs(experiment) {
  return (
    experiment.metadata.registry.inputs != null &&
    experiment.metadata.registry.inputs.length > 0
  );
}

export function getDeveloperMetadataScore(experiment) {
  //
  let totalScore = 1;
  let numberOfTests = 5;
  let weight = totalScore / numberOfTests;

  //
  let packageHasDescription = checkParameterisedPackageHasDescription(
    experiment
  )
    ? weight
    : 0;
  let packageHasMaintainer = checkParameterisedPackageHasMaintainer(experiment)
    ? weight
    : 0;
  let packageHasLicense = checkParameterisedPackageHasLicense(experiment)
    ? weight
    : 0;
  let packageHasTagOtherThanLatest =
    checkParameterisedPackageHasTagOtherThanLatest(experiment) ? weight : 0;
  let packageListsInputs = checkParameterisedPackageListsInputs(experiment)
    ? weight
    : 0;

  return Math.round(
    100 *
      (packageHasDescription +
        packageHasMaintainer +
        packageHasLicense +
        packageHasTagOtherThanLatest +
        packageListsInputs)
  );
}
