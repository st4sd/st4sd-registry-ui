<!-- 
  Copyright IBM Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0

  Author: Alessandro Pomponio
-->
<template>
  <div>
    <!-- Loading -->
    <template v-if="loading != 0"
      ><bx-progress-indicator-skeleton class="ve-progress-indicator" vertical>
        <bx-progress-step-skeleton vertical></bx-progress-step-skeleton>
        <bx-progress-step-skeleton vertical></bx-progress-step-skeleton>
        <bx-progress-step-skeleton vertical></bx-progress-step-skeleton>
        <bx-progress-step-skeleton
          vertical
        ></bx-progress-step-skeleton> </bx-progress-indicator-skeleton
    ></template>
    <!-- Ready -->
    <template v-else
      ><bx-progress-indicator class="ve-progress-indicator" vertical>
        <!-- Strong versioning -->
        <bx-progress-step
          label-text="Strong versioning"
          :secondary-label-text="`${getStrongVersioningScore(experiment)}%`"
          :state="getIndicatorState(getStrongVersioningScore(experiment))"
          @click="openModal('strong-versioning-modal')"
        ></bx-progress-step>

        <!-- Virtual experiment interface -->
        <bx-progress-step
          label-text="Virtual-experiment interface"
          @click="openModal('virtual-experiment-interface-modal')"
          :secondary-label-text="interfaceStatus"
          :state="getIndicatorState(checkVeInterfaceIsPresent(experiment))"
        ></bx-progress-step>

        <!-- Developer metadata -->
        <bx-progress-step
          label-text="Developer metadata"
          :secondary-label-text="`${getDeveloperMetadataScore(experiment)}%`"
          @click="openModal('developer-metadata-modal')"
          :state="getIndicatorState(getDeveloperMetadataScore(experiment))"
        ></bx-progress-step>

        <!-- Execution environment -->
        <bx-progress-step
          label-text="ST4SD best practices"
          :secondary-label-text="`${getBestPracticesScore(experiment)}%`"
          @click="openModal('best-practices-modal')"
          :state="getIndicatorState(getBestPracticesScore(experiment))"
        ></bx-progress-step>
      </bx-progress-indicator>

      <!-- Modals -->
      <!-- Strong versioning modal -->
      <bx-modal id="strong-versioning-modal">
        <bx-modal-header>
          <bx-modal-close-button></bx-modal-close-button>
          <bx-modal-label>ST4SD Best Practices</bx-modal-label>
          <bx-modal-heading>Strong versioning</bx-modal-heading>
        </bx-modal-header>
        <bx-modal-body
          ><dds-structured-list col-span-1="13" col-span-2="2" col-span-3="3">
            <dds-structured-list-header-row>
              <dds-structured-list-header-cell
                >Check</dds-structured-list-header-cell
              >
              <dds-structured-list-header-cell
                >Info</dds-structured-list-header-cell
              ><dds-structured-list-header-cell
                >Status</dds-structured-list-header-cell
              >
            </dds-structured-list-header-row>
            <dds-structured-list-body>
              <dds-structured-list-row>
                <dds-structured-list-cell
                  >Container images in this experiment are using tags other than
                  <code>latest</code></dds-structured-list-cell
                ><dds-structured-list-cell
                  tooltip="The image referenced by the latest tag will likely change over time"
                >
                </dds-structured-list-cell
                ><dds-structured-list-cell>
                  <div
                    v-html="
                      getTestIcon(
                        checkContainerImagesHaveTagOtherThanLatest(experiment)
                      )
                    "
                  ></div
                ></dds-structured-list-cell>
              </dds-structured-list-row>
              <dds-structured-list-row>
                <dds-structured-list-cell
                  >Experiment is stored on a Git repository and specifies a
                  commit ID or a tag</dds-structured-list-cell
                ><dds-structured-list-cell
                  tooltip="This ensures that the experiment package definition will not change over time"
                >
                </dds-structured-list-cell
                ><dds-structured-list-cell
                  ><div
                    v-html="
                      getTestIcon(checkBasePackagesHaveCommitOrTag(experiment))
                    "
                  ></div
                ></dds-structured-list-cell>
              </dds-structured-list-row>
            </dds-structured-list-body> </dds-structured-list
        ></bx-modal-body>
        <bx-modal-footer>
          <bx-modal-footer-button kind="primary" data-modal-close
            >Close</bx-modal-footer-button
          >
        </bx-modal-footer>
      </bx-modal>

      <!-- Virtual experiment interface modal -->
      <bx-modal id="virtual-experiment-interface-modal">
        <bx-modal-header>
          <bx-modal-close-button></bx-modal-close-button>
          <bx-modal-label>ST4SD Best Practices</bx-modal-label>
          <bx-modal-heading>Virtual experiment interface</bx-modal-heading>
        </bx-modal-header>
        <bx-modal-body
          ><dds-structured-list col-span-1="13" col-span-2="2" col-span-3="3">
            <dds-structured-list-header-row>
              <dds-structured-list-header-cell
                >Check</dds-structured-list-header-cell
              >
              <dds-structured-list-header-cell
                >Info</dds-structured-list-header-cell
              ><dds-structured-list-header-cell
                >Status</dds-structured-list-header-cell
              >
            </dds-structured-list-header-row>
            <dds-structured-list-body>
              <dds-structured-list-row>
                <dds-structured-list-cell
                  >The experiment has a virtual experiment
                  interface</dds-structured-list-cell
                ><dds-structured-list-cell
                  tooltip="A virtual-experiment interface makes information retrieval and integrations easier"
                >
                </dds-structured-list-cell
                ><dds-structured-list-cell
                  ><div
                    v-html="getTestIcon(checkVeInterfaceIsPresent(experiment))"
                  ></div
                ></dds-structured-list-cell>
              </dds-structured-list-row>
            </dds-structured-list-body> </dds-structured-list
        ></bx-modal-body>
        <bx-modal-footer>
          <bx-modal-footer-button kind="primary" data-modal-close
            >Close</bx-modal-footer-button
          >
        </bx-modal-footer>
      </bx-modal>

      <!-- Developer metadata modal -->
      <bx-modal id="developer-metadata-modal">
        <bx-modal-header>
          <bx-modal-close-button></bx-modal-close-button>
          <bx-modal-label>ST4SD Best Practices</bx-modal-label>
          <bx-modal-heading>Developer metadata</bx-modal-heading>
        </bx-modal-header>
        <bx-modal-body
          ><dds-structured-list col-span-1="13" col-span-2="2" col-span-3="3">
            <dds-structured-list-header-row>
              <dds-structured-list-header-cell
                >Check</dds-structured-list-header-cell
              >
              <dds-structured-list-header-cell
                >Info</dds-structured-list-header-cell
              ><dds-structured-list-header-cell
                >Status</dds-structured-list-header-cell
              >
            </dds-structured-list-header-row>
            <dds-structured-list-body>
              <dds-structured-list-row>
                <dds-structured-list-cell
                  >Parameterised package has a
                  description</dds-structured-list-cell
                ><dds-structured-list-cell
                  tooltip="This helps other users understand more easily what the experiment does"
                >
                </dds-structured-list-cell
                ><dds-structured-list-cell
                  ><div
                    v-html="
                      getTestIcon(
                        checkParameterisedPackageHasDescription(experiment)
                      )
                    "
                  ></div
                ></dds-structured-list-cell>
              </dds-structured-list-row>
              <dds-structured-list-row>
                <dds-structured-list-cell
                  >Parameterised package specifies a
                  maintainer</dds-structured-list-cell
                ><dds-structured-list-cell
                  tooltip="This allows users to get in touch with someone in case of need"
                >
                </dds-structured-list-cell
                ><dds-structured-list-cell
                  ><div
                    v-html="
                      getTestIcon(
                        checkParameterisedPackageHasMaintainer(experiment)
                      )
                    "
                  ></div
                ></dds-structured-list-cell>
              </dds-structured-list-row>
              <dds-structured-list-row>
                <dds-structured-list-cell
                  >Parameterised package specifies a
                  license</dds-structured-list-cell
                ><dds-structured-list-cell
                  tooltip="This helps the user be aware of any kind of restrictions on modification and reuse"
                >
                </dds-structured-list-cell
                ><dds-structured-list-cell
                  ><div
                    v-html="
                      getTestIcon(
                        checkParameterisedPackageHasLicense(experiment)
                      )
                    "
                  ></div
                ></dds-structured-list-cell>
              </dds-structured-list-row>
              <dds-structured-list-row>
                <dds-structured-list-cell
                  >Parameterised package has a tag other than
                  <code>latest</code></dds-structured-list-cell
                ><dds-structured-list-cell
                  tooltip="Developers should define a tag other than latest to help strong versioning requirements"
                >
                </dds-structured-list-cell
                ><dds-structured-list-cell
                  ><div
                    v-html="
                      getTestIcon(
                        checkParameterisedPackageHasTagOtherThanLatest(
                          experiment
                        )
                      )
                    "
                  ></div
                ></dds-structured-list-cell>
              </dds-structured-list-row>
              <dds-structured-list-row>
                <dds-structured-list-cell
                  >Parameterised package lists its
                  inputs</dds-structured-list-cell
                ><dds-structured-list-cell
                  tooltip="Developers should list the inputs of their experiments"
                >
                </dds-structured-list-cell
                ><dds-structured-list-cell
                  ><div
                    v-html="
                      getTestIcon(
                        checkParameterisedPackageListsInputs(experiment)
                      )
                    "
                  ></div
                ></dds-structured-list-cell>
              </dds-structured-list-row>
            </dds-structured-list-body> </dds-structured-list
        ></bx-modal-body>
        <bx-modal-footer>
          <bx-modal-footer-button kind="primary" data-modal-close
            >Close</bx-modal-footer-button
          >
        </bx-modal-footer>
      </bx-modal>

      <!-- Best practices modal -->
      <bx-modal id="best-practices-modal">
        <bx-modal-header>
          <bx-modal-close-button></bx-modal-close-button>
          <bx-modal-label>ST4SD Best Practices</bx-modal-label>
          <bx-modal-heading>Summary</bx-modal-heading>
        </bx-modal-header>
        <bx-modal-body
          ><dds-structured-list col-span-1="13" col-span-2="2" col-span-3="3">
            <dds-structured-list-header-row>
              <dds-structured-list-header-cell
                >Check</dds-structured-list-header-cell
              >
              <dds-structured-list-header-cell
                >Score</dds-structured-list-header-cell
              ><dds-structured-list-header-cell
                >Status</dds-structured-list-header-cell
              >
            </dds-structured-list-header-row>
            <dds-structured-list-body>
              <dds-structured-list-row>
                <dds-structured-list-cell
                  >Strong versioning score</dds-structured-list-cell
                ><dds-structured-list-cell>
                  {{
                    getStrongVersioningScore(experiment)
                  }}% </dds-structured-list-cell
                ><dds-structured-list-cell
                  ><div
                    v-html="getTestIcon(getStrongVersioningScore(experiment))"
                  ></div
                ></dds-structured-list-cell>
              </dds-structured-list-row>
              <dds-structured-list-row>
                <dds-structured-list-cell
                  >Virtual experiment interface score</dds-structured-list-cell
                ><dds-structured-list-cell
                  v-if="checkVeInterfaceIsPresent(experiment)"
                  >Pass</dds-structured-list-cell
                >
                <dds-structured-list-cell v-else>Fail</dds-structured-list-cell
                ><dds-structured-list-cell
                  ><div
                    v-html="getTestIcon(checkVeInterfaceIsPresent(experiment))"
                  ></div
                ></dds-structured-list-cell>
              </dds-structured-list-row>
              <dds-structured-list-row>
                <dds-structured-list-cell
                  >Developer metadata score</dds-structured-list-cell
                ><dds-structured-list-cell>
                  {{
                    getDeveloperMetadataScore(experiment)
                  }}% </dds-structured-list-cell
                ><dds-structured-list-cell
                  ><div
                    v-html="getTestIcon(getDeveloperMetadataScore(experiment))"
                  ></div
                ></dds-structured-list-cell>
              </dds-structured-list-row>
            </dds-structured-list-body> </dds-structured-list
        ></bx-modal-body>
        <bx-modal-footer>
          <bx-modal-footer-button kind="primary" data-modal-close
            >Close</bx-modal-footer-button
          >
        </bx-modal-footer>
      </bx-modal>
    </template>
  </div>
</template>

<script>
import {
  checkContainerImagesHaveTagOtherThanLatest,
  checkBasePackagesHaveCommitOrTag,
  getStrongVersioningScore,
} from "@/functions/strong_versioning.js";

import {
  checkParameterisedPackageHasDescription,
  checkParameterisedPackageHasLicense,
  checkParameterisedPackageHasMaintainer,
  checkParameterisedPackageHasTagOtherThanLatest,
  getDeveloperMetadataScore,
  checkParameterisedPackageListsInputs,
} from "@/functions/developer_metadata.js";
import { checkVeInterfaceIsPresent } from "@/functions/ve_interface";
import { getBestPracticesScore } from "@/functions/best_practices";

// Icons
const successGreenImage = require("../../assets/checkmark--filled.svg");
const warningYellowImage = require("../../assets/warning--filled.svg");
const failRedImage = require("../../assets/misuse.svg");
//
const successGreenImageHTML = `<img width="20" height="20" class="success-green" src="${successGreenImage}" />`;
const warningYellowImageHTML = `<img width="20" height="20" class="warning-yellow" src="${warningYellowImage}" />`;
const failRedImageHTML = `<img width="20" height="20" class="fail-red" src="${failRedImage}" />`;

export default {
  name: "ST4SDBestPracticesProgressIndicator",
  props: {
    experiment: {
      type: Object,
      default: null,
    },
    loading: {
      type: Number,
      default: 4,
    },
  },
  computed: {
    interfaceStatus() {
      return checkVeInterfaceIsPresent(this.experiment) ? "Present" : "Missing";
    },
  },
  methods: {
    checkContainerImagesHaveTagOtherThanLatest,
    checkBasePackagesHaveCommitOrTag,
    getStrongVersioningScore,
    checkVeInterfaceIsPresent,
    checkParameterisedPackageHasDescription,
    checkParameterisedPackageHasLicense,
    checkParameterisedPackageHasMaintainer,
    checkParameterisedPackageHasTagOtherThanLatest,
    getDeveloperMetadataScore,
    getBestPracticesScore,
    checkParameterisedPackageListsInputs,
    openModal(id) {
      document.getElementById(id).open = true;
    },
    getIndicatorState(testResult) {
      if (typeof testResult == "boolean") {
        return testResult ? "complete" : "invalid";
      } else {
        if (testResult == 100) return "complete";
        else if (testResult <= 50) return "invalid";
        else return "current";
      }
    },
    getTestIcon(testResult) {
      if (typeof testResult == "boolean") {
        // Return
        // Green checkmark if true
        // Red fail sign if false
        if (testResult) {
          return successGreenImageHTML;
        } else {
          return failRedImageHTML;
        }
      } else if (typeof testResult == "number") {
        // Return
        // Green checkmark if 100
        // Yellow warning sign if 50 or lower
        // Red fail sign if false
        if (testResult == 100) {
          return successGreenImageHTML;
        } else if (testResult >= 50) {
          return warningYellowImageHTML;
        } else {
          return failRedImageHTML;
        }
      }
    },
  },
};
</script>

<style lang="scss">
.success-green {
  // Simulate color of IBM success icon
  // Source: https://codepen.io/sosuke/pen/Pjoqqp
  // Input: #198038
  filter: invert(23%) sepia(54%) saturate(4018%) hue-rotate(136deg)
    brightness(90%) contrast(80%);
}

.fail-red {
  // Simulate color of IBM failure icon
  // Source: https://codepen.io/sosuke/pen/Pjoqqp
  // Input: #da1e28
  filter: invert(12%) sepia(82%) saturate(4571%) hue-rotate(349deg)
    brightness(113%) contrast(90%);
}

.warning-yellow {
  // Simulate color of IBM failure icon
  // Source: https://codepen.io/sosuke/pen/Pjoqqp
  // Input: #f1c21b
  filter: invert(69%) sepia(82%) saturate(455%) hue-rotate(2deg) brightness(98%)
    contrast(94%);
}
</style>
