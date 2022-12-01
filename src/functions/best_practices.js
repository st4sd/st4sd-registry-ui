/*
    Copyright IBM Inc. All Rights Reserved.
    SPDX-License-Identifier: Apache-2.0

    Author: Alessandro Pomponio
*/
import { getDeveloperMetadataScore } from "./developer_metadata";
import { getStrongVersioningScore } from "./strong_versioning";
import { checkVeInterfaceIsPresent } from "./ve_interface";

export function getBestPracticesScore(experiment) {
  //
  let numberOfTests = 3;

  //
  let strongVersioningScore = getStrongVersioningScore(experiment);
  let interfacePresent = checkVeInterfaceIsPresent(experiment) ? 100 : 0;
  let developerMetadataScore = getDeveloperMetadataScore(experiment);

  return Math.round(
    (strongVersioningScore + developerMetadataScore + interfacePresent) /
      numberOfTests
  );
}
