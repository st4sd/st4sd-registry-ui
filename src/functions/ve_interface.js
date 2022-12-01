/*
    Copyright IBM Inc. All Rights Reserved.
    SPDX-License-Identifier: Apache-2.0

    Author: Alessandro Pomponio
*/
export function checkVeInterfaceIsPresent(experiment) {
  return Object.keys(experiment.metadata.registry.interface).length != 0;
}
