<template>
  <!-- Experiment header -->
  <div class="cds--row">
    <!-- Left column  -->
    <div class="cds--col-sm-4 cds--col-md-8 cds--col-lg-12">
      <!-- Experiment name and description -->
      <div>
        <c4d-content-block>
          <c4d-content-block-heading>{{
            experiment.metadata.package.name
          }}</c4d-content-block-heading>
          <c4d-content-block-copy>
            {{ experiment.metadata.package.description }}
          </c4d-content-block-copy>

          <!-- Experiment tags -->
          <div class="tag-group-container">
            <!-- Virtual experiment -->
            <cds-tag v-if="checkVeInterfaceIsPresent(experiment)" type="green">
              virtual-experiment
            </cds-tag>
            <!-- Platforms -->
            <cds-tag
              v-for="option in getAvailablePlatforms"
              :key="`platformoption-${option}`"
              type="red"
            >
              platform: {{ option }}
            </cds-tag>
            <!-- Tags -->
            <cds-tag
              v-for="(tag, idx) in experiment.metadata.registry.tags"
              :key="`registrytag-${idx}`"
              type="blue"
            >
              tag: {{ tag }}
            </cds-tag>
            <!-- Digest -->
            <!-- AP: cds-tag has a set max-inline-size value which force the component to take multiple lines -->
            <cds-tag type="blue" style="max-inline-size: fit-content">
              digest: {{ experiment.metadata.registry.digest }}
            </cds-tag>
          </div>

          <!-- eslint-disable -->
          <c4d-link-list type="end">
            <c4d-link-list-item
              v-if="!isGlobalRegistry"
              :href="`${getDeploymentEndpoint()}experiment/${id}/runs`"
            >
              View Runs
              <img
                slot="icon"
                src="@/assets/arrow--right.svg"
                width="20"
                height="20"
              />
            </c4d-link-list-item>
            <c4d-link-list-item
              v-if="!isCanvasDisabled"
              :href="`${getDeploymentEndpoint()}experiment/${id}/viewcanvas`"
            >
              View Graph
              <img
                slot="icon"
                src="@/assets/arrow--right.svg"
                width="20"
                height="20"
              />
            </c4d-link-list-item>
            <c4d-link-list-item
              :href="`${getDeploymentEndpoint()}experiment/${id}/parameterisation-options`"
              v-if="isParameterisationEnabled"
            >
              Parameterisation Options
              <img
                slot="icon"
                src="@/assets/arrow--right.svg"
                width="20"
                height="20"
              />
            </c4d-link-list-item>
            <c4d-link-list-item
              v-if="isRunExperimentEnabled"
              @click="
                toggleModalVisibility('runExperimentFormTearsheetVisibility')
              "
            >
              Run Experiment
              <img
                slot="icon"
                src="@/assets/arrow--right.svg"
                width="20"
                height="20"
              />
            </c4d-link-list-item>
            <c4d-link-list-item
              v-if="isBuildCanvasEditingEnabled"
              :href="`${getDeploymentEndpoint()}experiment/${this.id}/edit`"
              :disabled="
                !experiment.metadata.package.keywords.includes(
                  'internal-experiment',
                )
              "
              :title="
                !experiment.metadata.package.keywords.includes(
                  'internal-experiment',
                )
                  ? 'This experiment was created outside the canvas and therefore it cannot be edited'
                  : ''
              "
            >
              Edit Experiment
              <img
                v-if="
                  experiment.metadata.package.keywords.includes(
                    'internal-experiment',
                  )
                "
                slot="icon"
                src="@/assets/arrow--right.svg"
                width="20"
                height="20"
              />
            </c4d-link-list-item>
          </c4d-link-list>
        </c4d-content-block>
        <!-- eslint-enable -->
      </div>
    </div>

    <!-- Right column -->
    <div class="cds--col-sm-4 cds--col-md-8 cds--col-lg-4 pad1">
      <!-- Progress indicator -->
      <St4sdBestPracticesProgressIndicator
        :loading="loading"
        :experiment="experiment"
      />
    </div>
    <FileConfigurationTearsheet
      :isOpen="openFileConfigurationTearsheet"
      @cds-tearsheet-closed="
        openFileConfigurationTearsheet = !openFileConfigurationTearsheet
      "
      :fileName="fileName"
      :fileConfiguration="fileConfiguration"
      @push-to-toast-errors="$emit('push-to-toast-errors', $event)"
    />
    <runExperimentFormTearsheet
      :experiment="experiment"
      :open="runExperimentFormTearsheetVisibility"
      :runExperimentFormEmit="runExperimentFormEmit"
      @cds-tearsheet-closed="
        toggleModalVisibility('runExperimentFormTearsheetVisibility')
      "
      @file-being-configured="startFileConfiguration"
      @st4sd-experiment-run-submitted="postRunExperimentForm"
    />
  </div>
</template>

<script>
import "@carbon/ibmdotcom-web-components/es/components/content-block/index.js";
import "@carbon/web-components/es/components/tag/index.js";
import "@carbon/ibmdotcom-web-components/es/components/link-list/index.js";

import St4sdBestPracticesProgressIndicator from "@/components/St4sdBestPracticesProgressIndicator";
import runExperimentFormTearsheet from "@/canvas/components/tearsheets/runExperimentFormTearsheet.vue";

import { checkVeInterfaceIsPresent } from "@/functions/ve_interface";
import { getDeploymentEndpoint } from "@/functions/public_path";

import axios from "axios";
import router from "@/router";
import FileConfigurationTearsheet from "@/components/ExperimentView/FileConfigurationTearsheet.vue";
import { tearsheetsSharedState } from "@/stores/experimentTearsheetSharedState";
import { FileConfiguration } from "@/classes/FileConfiguration.js";

export default {
  name: "PageHero",
  components: {
    St4sdBestPracticesProgressIndicator,
    runExperimentFormTearsheet,
    FileConfigurationTearsheet,
  },
  props: {
    experiment: Object,
    id: String,
    isParameterisationEnabled: Boolean,
    isRunExperimentEnabled: Boolean,
    isCanvasDisabled: Boolean,
    isGlobalRegistry: Boolean,
    isBuildCanvasEditingEnabled: Boolean,
    loading: Number,
    getAvailablePlatforms: Array,
  },
  data() {
    return {
      modalActive: false,
      runModalActive: false,
      runExperimentFormEmit: false,
      runExperimentPayload: {},
      runExperimentFormTearsheetVisibility: false,
      openFileConfigurationTearsheet: false,

      //
      fileName: "",
      fileConfiguration: new FileConfiguration(),
    };
  },
  emits: ["push-to-toast-errors"],
  methods: {
    checkVeInterfaceIsPresent,
    getDeploymentEndpoint,
    startFileConfiguration(event) {
      this.fileName = event;
      // AP 18/11/24:
      // We need to set the file configuration based on whether we have
      // it in the files or not. This is to ensure the file configuration
      // panels have the correct data
      this.fileConfiguration = tearsheetsSharedState.files.has(this.fileName)
        ? tearsheetsSharedState.files.get(this.fileName)
        : new FileConfiguration();
      this.openFileConfigurationTearsheet =
        !this.openFileConfigurationTearsheet;
    },
    toggleModalVisibility(modal) {
      this[modal] = !this[modal];
    },
    toggleRunExperimentFormEmit() {
      this.runExperimentFormEmit = !this.runExperimentFormEmit;
    },
    async postRunExperimentForm() {
      let data = await tearsheetsSharedState.generateExperimentPayload(
        this.experiment,
      );
      axios
        .post(
          window.location.origin +
            `/registry-ui/backend/experiments/${this.id}/start`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        )
        .then((response) => {
          if (response.status == 200) {
            router.push({
              path: `/experiment/${this.id}/runs/${response.data.run_id}`,
            });
          }
        })
        .catch((error) => {
          if (error.response.status == 400) {
            alert(`${error.response.data.message}`);
          } else {
            alert(
              "Experiment not found or internal error while creating experiment",
            );
          }
        });
      this.toggleRunExperimentFormEmit();
      tearsheetsSharedState.clear();
    },
    filterResponseReason(reason) {
      let strArr = reason.split("");
      let startIndex = strArr.indexOf(")") + 1;
      let newStrArr = strArr.slice(startIndex);
      let endIndex = newStrArr.indexOf(".");
      return newStrArr.slice(0, endIndex).join("");
    },
  },
};
</script>

<style scoped lang="scss">
@use "@carbon/layout";
@use "@/styles/cds-tag-styles.scss";

c4d-content-block {
  margin: 0 0 layout.$spacing-09 0;
}

c4d-content-block-heading,
c4d-content-block-copy {
  margin-left: 0;
}

c4d-cta-block {
  display: inline;
}

c4d-link-list {
  margin-top: layout.$spacing-07;

  @media screen and (max-width: 671px) {
    margin-left: 0;
  }
}
</style>
