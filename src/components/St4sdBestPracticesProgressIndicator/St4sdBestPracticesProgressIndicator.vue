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
      ><bx-progress-indicator
        class="ve-progress-indicator"
        :vertical="direction"
      >
        <!-- Strong versioning -->
        <bx-progress-step
          id="strongVersioning"
          class="mediumHorizontalSpacing"
          label-text="Strong versioning"
          :secondary-label-text="`${getStrongVersioningScore(experiment)}%`"
          @click="openModal('strong-versioning-modal')"
        ></bx-progress-step>

        <!-- Virtual experiment interface -->
        <bx-progress-step
          id="virtualExperimentInterface"
          class="mediumHorizontalSpacing"
          label-text="Virtual-experiment interface"
          @click="openModal('virtual-experiment-interface-modal')"
          :secondary-label-text="interfaceStatus"
        ></bx-progress-step>

        <!-- Developer metadata -->
        <bx-progress-step
          id="developerMetadata"
          class="mediumHorizontalSpacing"
          label-text="Developer metadata"
          :secondary-label-text="`${getDeveloperMetadataScore(experiment)}%`"
          @click="openModal('developer-metadata-modal')"
        ></bx-progress-step>

        <!-- Execution environment -->
        <bx-progress-step
          id="ST4SDBestPractices"
          class="mediumHorizontalSpacing"
          label-text="ST4SD best practices"
          :secondary-label-text="`${getBestPracticesScore(experiment)}%`"
          @click="openModal('best-practices-modal')"
        ></bx-progress-step>
      </bx-progress-indicator>

      <!-- Modals -->

      <!-- Strong versioning modal -->
      <St4sdModal
        id="strong-versioning-modal"
        title="Strong Versioning"
        heading1="Check"
        heading2="Info"
        heading3="Status"
        :structuredListData="strongVersioningData"
      />

      <!-- Virtual experiment interface modal -->
      <St4sdModal
        id="virtual-experiment-interface-modal"
        title="Virtual experiment interface"
        heading1="Check"
        heading2="Info"
        heading3="Status"
        :structuredListData="VEInterfaceData"
      />

      <!-- Developer metadata modal -->
      <St4sdModal
        id="developer-metadata-modal"
        title="Developer metadata"
        heading1="Check"
        heading2="Info"
        heading3="Status"
        :structuredListData="developerMetadataData"
      />

      <!-- Best practices modal -->
      <St4sdModal
        id="best-practices-modal"
        title="Summary"
        heading1="Check"
        heading2="Score"
        heading3="Status"
        :structuredListData="bestPracticesData"
      />
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
import St4sdModal from "@/components/St4sdBestPracticesProgressIndicator/St4sdModal.vue";

// Icons
import successGreenImage from "../../assets/checkmark--filled.svg";
import warningYellowImage from "../../assets/warning--filled.svg";
import failRedImage from "../../assets/misuse.svg";
//
const successGreenImageHTML = `<img width="20" height="20" class="success-green" src="${successGreenImage}" />`;
const warningYellowImageHTML = `<img width="20" height="20" class="warning-yellow" src="${warningYellowImage}" />`;
const failRedImageHTML = `<img width="20" height="20" class="fail-red" src="${failRedImage}" />`;

export default {
  name: "ST4SDBestPracticesProgressIndicator",
  components: {
    St4sdModal,
  },
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
  data() {
    return {
      direction: true,
      width: document.documentElement.clientWidth,
      strongVersioningData: [
        {
          col1: "Container images in this experiment are using tags other than <code>latest</code>",
          col2: "The image referenced by the latest tag will likely change over time",
          col2Type: "info",
          col3: this.getTestIcon(
            checkContainerImagesHaveTagOtherThanLatest(this.experiment),
          ),
        },
        {
          col1: "Experiment is stored on a Git repository and specifies a commit ID or a tag",
          col2: "This ensures that the experiment package definition will not change over time",
          col2Type: "info",
          col3: this.getTestIcon(
            checkBasePackagesHaveCommitOrTag(this.experiment),
          ),
        },
      ],
      VEInterfaceData: [
        {
          col1: "The experiment has a virtual experiment interface",
          col2: "A virtual-experiment interface makes information retrieval and integrations easier",
          col2Type: "info",
          col3: this.getTestIcon(checkVeInterfaceIsPresent(this.experiment)),
        },
      ],
      developerMetadataData: [
        {
          col1: "Parameterised package has a description",
          col2: "This helps other users understand more easily what the experiment does",
          col2Type: "info",
          col3: this.getTestIcon(
            checkParameterisedPackageHasDescription(this.experiment),
          ),
        },
        {
          col1: "Parameterised package specifies a maintainer",
          col2: "This allows users to get in touch with someone in case of need",
          col2Type: "info",
          col3: this.getTestIcon(
            checkParameterisedPackageHasMaintainer(this.experiment),
          ),
        },
        {
          col1: "Parameterised package specifies a license",
          col2: "This helps the user be aware of any kind of restrictions on modification and reuse",
          col2Type: "info",
          col3: this.getTestIcon(
            checkParameterisedPackageHasLicense(this.experiment),
          ),
        },
        {
          col1: "Parameterised package has a tag other than <code>latest</code>",
          col2: "Developers should define a tag other than latest to help strong versioning requirements",
          col2Type: "info",
          col3: this.getTestIcon(
            checkParameterisedPackageHasTagOtherThanLatest(this.experiment),
          ),
        },
        {
          col1: "Parameterised package lists its inputs",
          col2: "Developers should list the inputs of their experiments",
          col2Type: "info",
          col3: this.getTestIcon(
            checkParameterisedPackageListsInputs(this.experiment),
          ),
        },
      ],
      bestPracticesData: [
        {
          col1: "Strong versioning score",
          col2: this.getStrongVersioningScore(this.experiment) + "%",
          col2Type: "score",
          col3: this.getTestIcon(getStrongVersioningScore(this.experiment)),
        },
        {
          col1: "Virtual experiment interface score",
          col2: this.checkVeInterfaceIsPresent(this.experiment)
            ? "Pass"
            : "Fail",
          col2Type: "score",
          col3: this.getTestIcon(checkVeInterfaceIsPresent(this.experiment)),
        },
        {
          col1: "Developer metadata score",
          col2: this.getDeveloperMetadataScore(this.experiment) + "%",
          col2Type: "score",
          col3: this.getTestIcon(getDeveloperMetadataScore(this.experiment)),
        },
      ],
    };
  },
  mounted() {
    window.addEventListener("resize", this.getWidth);
    this.getWidth();
    document
      .getElementById("strongVersioning")
      .setAttribute(
        "state",
        this.getIndicatorState(this.getStrongVersioningScore(this.experiment)),
      );
    document
      .getElementById("virtualExperimentInterface")
      .setAttribute(
        "state",
        this.getIndicatorState(this.checkVeInterfaceIsPresent(this.experiment)),
      );
    document
      .getElementById("developerMetadata")
      .setAttribute(
        "state",
        this.getIndicatorState(this.getDeveloperMetadataScore(this.experiment)),
      );
    document
      .getElementById("ST4SDBestPractices")
      .setAttribute(
        "state",
        this.getIndicatorState(this.getBestPracticesScore(this.experiment)),
      );
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
    getWidth() {
      this.width = window.innerWidth;
      if (this.width >= 672 && this.width < 1056) {
        this.direction = false;
      } else {
        this.direction = true;
      }
    },
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

@media screen and (max-width: 1055px) and (min-width: 672px) {
  .mediumHorizontalSpacing {
    width: 25%;
  }
}
</style>
