<!-- 
  Copyright IBM Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0

  Author: Alessandro Pomponio
-->
<template>
  <!-- Navigation breadcrumb -->
  <div>
    <div id="toast-notification-container">
      <cds-toast-notification
        v-for="error in errors"
        :key="error.description"
        kind="error"
        :title="error.description"
        :caption="error.statusText + ' (error ' + error.code + ')'"
        timeout="5000"
        lowContrast
      />
    </div>
    <St4sdBreadcrumb
      :breadcrumbs="[
        { name: 'Virtual Experiments', path: '/' },
        {
          name: id,
          path: `/experiment/${id}`,
        },
      ]"
    />
    <!-- Show something while we're loading -->
    <template v-if="loading != 0">
      <div class="cds--row pad1">
        <div class="cds--col-lg-10">
          <p style="padding: 64px"></p>
          <cds-skeleton-text type="heading"></cds-skeleton-text>
          <p style="padding: 10px; margin: 10px"></p>
          <cds-skeleton-text type="line"></cds-skeleton-text>
          <cds-skeleton-text type="line"></cds-skeleton-text>
        </div>
        <div class="cds--col" style="padding: 64px">
          <cds-progress-indicator-skeleton
            class="ve-progress-indicator"
            vertical
          >
            <cds-progress-step-skeleton vertical></cds-progress-step-skeleton>
            <cds-progress-step-skeleton vertical></cds-progress-step-skeleton>
            <cds-progress-step-skeleton vertical></cds-progress-step-skeleton>
            <cds-progress-step-skeleton vertical></cds-progress-step-skeleton>
          </cds-progress-indicator-skeleton>
        </div>
      </div>
    </template>

    <template v-else-if="experimentError.code != 0">
      <div class="empty-state">
        <HttpErrorEmptyState
          id="http-error-empty-state"
          :errorDescription="experimentError.description"
          :errorStatusText="experimentError.statusText"
          :errorCode="experimentError.code"
        />
      </div>
    </template>

    <!-- Actual content -->
    <template v-else>
      <PageHeroVue
        :experiment="experiment"
        :loading="loading"
        :isGlobalRegistry="isGlobalRegistry"
        :isCanvasDisabled="isCanvasDisabled"
        :isRunExperimentEnabled="isRunExperimentEnabled"
        :isParameterisationEnabled="isParameterisationEnabled"
        :isBuildCanvasEditingEnabled="isBuildCanvasEditingEnabled"
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
        <ExperimentHistoryVue
          :error="historyError"
          :history="history"
          :data="data"
          :id="id"
        />
        <GetPackageWithSTP />
        <ExperimentJSONVue
          :exp_no_interface="exp_no_interface"
          :experiment="experiment"
        />
      </div>
    </template>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/notification/index.js";
import "@carbon/web-components/es/components/skeleton-text/index.js";
import "@carbon/web-components/es/components/progress-indicator/index.js";

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

import St4sdBreadcrumb from "@/components/St4sdBreadcrumb/St4sdBreadcrumb.vue";

import PageHeroVue from "@/components/ExperimentView/PageHero.vue";
import VirtualExperimentInterfaceVue from "@/components/ExperimentView/VirtualExperimentInterface.vue";
import ExperimentInputsVue from "@/components/ExperimentView/ExperimentInputs.vue";
import ExperimentParameterisationVue from "@/components/ExperimentView/ExperimentParameterisation.vue";
import PackageInfoBaseVue from "@/components/ExperimentView/PackageInfoBase.vue";
import PackageInfoContainerVue from "@/components/ExperimentView/PackageInfoContainer.vue";
import PackageInfoMetadataVue from "@/components/ExperimentView/PackageInfoMetadata.vue";
import ExperimentHistoryVue from "@/components/ExperimentView/ExperimentHistory.vue";
import GetPackageWithSTP from "@/components/ExperimentView/GetPackageWithSTP.vue";
import ExperimentJSONVue from "@/components/ExperimentView/ExperimentJSON.vue";
import { registryUISharedState } from "@/stores/registryUISharedState";
import axios from "axios";

import HttpErrorEmptyState from "@/components/EmptyState/HttpError.vue";

export default {
  name: "ExperimentView",
  components: {
    PageHeroVue,
    VirtualExperimentInterfaceVue,
    ExperimentInputsVue,
    ExperimentParameterisationVue,
    PackageInfoBaseVue,
    PackageInfoContainerVue,
    PackageInfoMetadataVue,
    ExperimentHistoryVue,
    GetPackageWithSTP,
    ExperimentJSONVue,
    TitleElement,
    St4sdBreadcrumb,
    HttpErrorEmptyState,
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
      loading: 4,
      data: null,
      isGlobalRegistry: false,
      isCanvasDisabled: false,
      isParameterisationEnabled: false,
      isRunExperimentEnabled: false,
      isBuildCanvasEditingEnabled: false,
      errors: [],
      experimentError: {
        description: "Unable to load experiment",
        statusText: "",
        code: 0,
      },
      historyError: {
        description: "Unable to load experiment history",
        statusText: "",
        code: 0,
      },
    };
  },
  mounted() {
    // Fetch experiment
    axios
      .get(
        window.location.origin + "/registry-ui/backend/experiments/" + this.id,
      )
      .then((response) => {
        this.experiment = response.data.entry;
      })
      .catch((error) => {
        this.experimentError.statusText = error.response.statusText;
        this.experimentError.code = error.response.status;
        this.errors.push(this.experimentError);
      })
      .finally(() => {
        this.loading--;
      });

    // Fetch experiment without interface
    axios
      .get(
        window.location.origin +
          "/registry-ui/backend/experiments/" +
          this.id +
          "?outputFormat=json&hideMetadataRegistry=y&hideNone=y&hideBeta=y",
      )
      .then((response) => {
        this.exp_no_interface = response.data.entry;
        for (var i = 0; i < this.exp_no_interface.base.packages.length; i++) {
          if ("git" in this.exp_no_interface.base.packages[i].source) {
            delete this.exp_no_interface.base.packages[i].source.git.version;
          }
        }
      })
      .catch((error) => {
        //Used description for description display name as it's the UI section it appears under
        this.errors.push({
          description: "Unable to load experiment description",
          statusText: error.response.statusText,
          code: error.response.status,
        });
        this.exp_no_interface = {};
      })
      .finally(() => {
        this.loading--;
      });

    // Fetch history
    axios
      .get(
        window.location.origin +
          "/registry-ui/backend/experiments/" +
          this.getPackageName(this.id) +
          "/history",
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
            })),
          );
      })
      .catch((error) => {
        this.historyError.statusText = error.response.statusText;
        this.historyError.code = error.response.status;
        this.errors.push(this.historyError);
      })
      .finally(() => {
        this.loading--;
      });

    // Fetch settings
    this.isParameterisationEnabled =
      registryUISharedState.isParameterisationEnabled;
    this.isRunExperimentEnabled = registryUISharedState.isRunExperimentEnabled;
    this.isCanvasDisabled = registryUISharedState.isCanvasDisabled;
    this.isGlobalRegistry = registryUISharedState.isGlobalRegistry;
    this.isBuildCanvasEditingEnabled =
      registryUISharedState.isBuildCanvasEditingEnabled;
    this.loading--;
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

<style scoped lang="scss">
@use "@carbon/layout";
@use "@carbon/colors";

@import "@/styles/ve-progress-indicator-styles.css";
@import "@/styles/toast-notification-styles.scss";

.empty-state {
  margin: 1rem 0;
}

#http-error-empty-state {
  min-height: 70vh;
}

.pad1 {
  padding-bottom: layout.$spacing-08;
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
