<!-- 
  Copyright IBM Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0

  Author: Alessandro Pomponio
-->
<template>
  <div class="cds--grid cds--grid--full-width">
    <!-- Show something while we're loading -->
    <template v-if="loading != 0">
      <LoadingOverlayVue />
    </template>

    <!-- Actual content -->
    <template v-else>
      <!-- Navigation breadcrumb -->
      <div class="breadcrumb">
        <bx-breadcrumb>
          <bx-breadcrumb-item>
            <router-link to="/">Virtual Experiments</router-link>
          </bx-breadcrumb-item>
          <bx-breadcrumb-item>
            <bx-breadcrumb-link aria-current="page">{{
              experiment.metadata.package.name
            }}</bx-breadcrumb-link>
          </bx-breadcrumb-item>
        </bx-breadcrumb>
      </div>

      <PageHeroVue
        :experiment="experiment"
        :loading="loading"
        :isGlobalRegistry="isGlobalRegistry"
        :id="id"
        :getAvailablePlatforms="getAvailablePlatforms()"
      />

      <VirtualExperimentInterfaceVue :experiment="experiment" />

      <ExperimentInputsVue :experiment="experiment" />

      <TitleElement
        title="Parameterisation"
        name="execution-details"
        :id="id"
      />
      <ExperimentParameterisationVue :experiment="experiment" :id="id" />

      <!-- Package history and information -->
      <div>
        <!-- Package history and info title -->
        <TitleElement
          title="Package Information"
          name="package-information"
          :id="id"
        />

        <PackageInfoBaseVue :experiment="experiment" />
        <PackageInfoContainerVue :experiment="experiment" />
        <PackageInfoMetadataVue
          :experiment="experiment"
          :getAvailablePlatforms="getAvailablePlatforms()"
          :tags="tags"
        />
        <ExperimentHistoryVue :history="history" :data="data" :id="id" />
        <AddPackageVue :exp_python="exp_python" />
        <ExperimentJSONVue
          :exp_no_interface="exp_no_interface"
          :experiment="experiment"
        />
      </div>
    </template>
  </div>
</template>

<script>
import "carbon-web-components/es/components/code-snippet/index.js";
import "@carbon/ibmdotcom-web-components/es/components/content-block/index.js";
import "@carbon/ibmdotcom-web-components/es/components/tag-group/index.js";
import "@carbon/ibmdotcom-web-components/es/components/structured-list/index.js";
import "@carbon/ibmdotcom-web-components/es/components/cta/text-cta.js";
import "carbon-web-components/es/components/tag/index.js";
import "carbon-web-components/es/components/button/index.js";
import "carbon-web-components/es/components/progress-indicator/index.js";
import "carbon-web-components/es/components/data-table/index.js";
import "carbon-web-components/es/components/list/index.js";
import "@carbon/ibmdotcom-web-components/es/components/content-item/index.js";
import "@carbon/ibmdotcom-web-components/es/components/horizontal-rule/index.js";
import "@carbon/ibmdotcom-web-components/es/components/link-list/index.js";
import "carbon-web-components/es/components/pagination/index.js";
import "carbon-web-components/es/components/loading/index.js";
import "carbon-web-components/es/components/skeleton-text/index.js";
import "carbon-web-components/es/components/progress-indicator/index.js";

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

import { getBestPracticesScore } from "@/functions/best_practices";

import TitleElement from "@/components/ExperimentView/TitleElement.vue";
import LoadingOverlayVue from "@/components/ExperimentView/LoadingOverlay.vue";
import PageHeroVue from "@/components/ExperimentView/PageHero.vue";
import VirtualExperimentInterfaceVue from "@/components/ExperimentView/VirtualExperimentInterface.vue";
import ExperimentInputsVue from "@/components/ExperimentView/ExperimentInputs.vue";
import ExperimentParameterisationVue from "@/components/ExperimentView/ExperimentParameterisation.vue";
import PackageInfoBaseVue from "@/components/ExperimentView/PackageInfoBase.vue";
import PackageInfoContainerVue from "@/components/ExperimentView/PackageInfoContainer.vue";
import PackageInfoMetadataVue from "@/components/ExperimentView/PackageInfoMetadata.vue";
import ExperimentHistoryVue from "@/components/ExperimentView/ExperimentHistory.vue";
import AddPackageVue from "@/components/ExperimentView/AddPackage.vue";
import ExperimentJSONVue from "@/components/ExperimentView/ExperimentJSON.vue";
import axios from "axios";

export default {
  name: "ExperimentView",
  components: {
    LoadingOverlayVue,
    PageHeroVue,
    VirtualExperimentInterfaceVue,
    ExperimentInputsVue,
    ExperimentParameterisationVue,
    PackageInfoBaseVue,
    PackageInfoContainerVue,
    PackageInfoMetadataVue,
    ExperimentHistoryVue,
    AddPackageVue,
    ExperimentJSONVue,
    TitleElement,
  },
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      experiment: null,
      exp_no_interface: null,
      history: null,
      tags: null,
      exp_python: null,
      loading: 5,
      data: null,
      isGlobalRegistry: false,
    };
  },
  mounted() {
    // Fetch experiment
    axios
      .get(
        window.location.origin + "/registry-ui/backend/experiments/" + this.id
      )
      .then((response) => {
        this.experiment = response.data.entry;
        this.loading--;
      });

    // Fetch experiment without interface
    axios
      .get(
        window.location.origin +
          "/registry-ui/backend/experiments/" +
          this.id +
          "?outputFormat=json&hideMetadataRegistry=y&hideNone=y&hideBeta=y"
      )
      .then((response) => {
        this.exp_no_interface = response.data.entry;
        for (var i = 0; i < this.exp_no_interface.base.packages.length; i++) {
          if ("git" in this.exp_no_interface.base.packages[i].source) {
            delete this.exp_no_interface.base.packages[i].source.git.version;
          }
        }
        this.loading--;
      });

    // Fetch history
    axios
      .get(
        window.location.origin +
          "/registry-ui/backend/experiments/" +
          this.getPackageName(this.id) +
          "/history"
      )
      .then((response) => {
        this.history = response.data;
        this.tags = response.data.tags.map((entry) => entry.tag);
        this.data = response.data.tags
          .map((entry) => ({
            createdOn: entry.createdOn,
            digest: entry.head,
            tag: entry.tag,
            timesExecuted: entry.timesExecuted,
          }))
          .concat(
            response.data.untagged.map((entry) => ({
              createdOn: entry.createdOn,
              digest: entry.digest,
              originalTag: entry.originalTag,
              timesExecuted: entry.timesExecuted,
            }))
          );
        this.loading--;
      });

    // Fetch python-version of the experiment
    axios
      .get(
        window.location.origin +
          "/registry-ui/backend/experiments/" +
          this.id +
          "?outputFormat=python&hideMetadataRegistry=y&hideNone=y"
      )
      .then((response) => {
        this.exp_python = response.data.entry;
        this.loading--;
      });

    // Fetch settings
    axios
      .get(window.location.origin + "/registry-ui/backend/settings/")
      .then((response) => {
        if (
          "ST4SD_REGISTRY_UI_SETTINGS_IS_GLOBAL" in response.data &&
          response.data["ST4SD_REGISTRY_UI_SETTINGS_IS_GLOBAL"] == "yes"
        )
          this.isGlobalRegistry = true;
        this.loading--;
      });
  },
  methods: {
    getPackageName(id) {
      var index = -1;
      if (id.includes(":")) {
        index = id.indexOf(":");
      } else if (id.includes("@")) {
        index = id.indexOf("@");
      }

      if (index == -1) return id;

      return id.substring(0, index);
    },
    getAvailablePlatforms() {
      var platforms = null;
      if (this.experiment.parameterisation.presets.platform != null) {
        platforms = [this.experiment.parameterisation.presets.platform];
      } else if (
        this.experiment.parameterisation.executionOptions.platform != null &&
        this.experiment.parameterisation.executionOptions.platform.length != 0
      ) {
        platforms = this.experiment.parameterisation.executionOptions.platform;
      } else {
        platforms = ["default"];
      }
      return platforms;
    },
    checkContainerImagesHaveTagOtherThanLatest,
    checkBasePackagesHaveCommitOrTag,
    getStrongVersioningScore,
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
  },
};
</script>

<style lang="scss">
@use "@carbon/grid";
@use "@carbon/layout";
@use "@carbon/colors";

.ve-progress-indicator {
  margin-top: 64px;
}

.ve-content-block {
  padding: 0;
}

.ve-heading {
  font-size: 1.5em;
}

.ve-copy {
  font-size: 1.2em;
  margin-left: 16px;
  margin-right: 16px;
}

.bx--btn--primary {
  margin-top: layout.$spacing-05;
}

.pad1 {
  padding-bottom: layout.$spacing-08;
}

.horizontal-line-spacing {
  margin-bottom: layout.$spacing-08;
}

.no-padding {
  padding: 0;
}

.arrow-link {
  // Simulate color of IBM links
  // Source: https://codepen.io/sosuke/pen/Pjoqqp
  // Input: #0f62fe
  filter: invert(30%) sepia(94%) saturate(4587%) hue-rotate(218deg)
    brightness(104%) contrast(103%);
}
</style>
