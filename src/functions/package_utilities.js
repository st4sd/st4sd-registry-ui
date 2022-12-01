/*
    Copyright IBM Inc. All Rights Reserved.
    SPDX-License-Identifier: Apache-2.0

    Author: Alessandro Pomponio
*/
export function getAvailablePlatforms(experiment) {
  var platforms = null;
  if (experiment.parameterisation.presets.platform != null) {
    platforms = [experiment.parameterisation.presets.platform];
  } else if (
    experiment.parameterisation.executionOptions.platform != null &&
    experiment.parameterisation.executionOptions.platform.length != 0
  ) {
    platforms = experiment.parameterisation.executionOptions.platform;
  } else {
    platforms = ["default"];
  }

  return platforms;
}
