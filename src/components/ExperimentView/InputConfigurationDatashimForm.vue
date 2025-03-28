<template>
  <div v-if="loading">LOADING</div>
  <div v-else>
    <div class="cds--subgrid">
      <cds-progress-indicator
        spaceEqually
        class="cds--css-grid-column cds--col-span-100"
      >
        <cds-progress-step
          id="addDatasetsStep"
          label="Add datasets"
          @click="pageNumber = 0"
        ></cds-progress-step>
        <cds-progress-step
          id="datasetConfigurationStep"
          label="Dataset Configuration"
          :disabled="!lastSelectedDatashimTile.isValid()"
          @click="pageNumber = 1"
        ></cds-progress-step>
      </cds-progress-indicator>
    </div>
    <div v-if="pageNumber == 0" class="cds--subgrid cds--subgrid--wide">
      <DatashimAddModifyDatasets
        :datasetConfigurations="datasetConfigurations"
        :lastSelectedDatashimTile="lastSelectedDatashimTile"
        :isInEdit="isInEdit"
        :datasetToEdit="datasetToEdit"
        @updateRadioTileGroupSelection="updateRadioTileGroupSelection($event)"
        @deleteDatasetConfiguration="deleteDatasetConfiguration($event)"
        @editDatasetConfiguration="editDatasetConfiguration($event)"
        @addNewDatasetConfiguration="addNewDatasetConfiguration($event)"
        @updateDatasetConfiguration="updateDatasetConfiguration($event)"
        @updateIsInEdit="isInEdit = $event"
      />
    </div>
    <div class="cds--subgrid cds--subgrid--wide" v-else>
      <div
        class="cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-8"
      >
        <cds-tile-group>
          <cds-radio-tile selected :value="lastSelectedDatashimTile">
            Name: {{ lastSelectedDatashimTile.name }}</cds-radio-tile
          >
        </cds-tile-group>
      </div>
      <cds-tile
        class="cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-8"
        style="padding-bottom: 32px"
      >
        <p>Provide a file name</p>
        <cds-form-group>
          <cds-text-input
            :value="fileName"
            @input="fileName = $event.target.value"
            class="fileNameInput"
            label="File name"
          />
        </cds-form-group>
      </cds-tile>
    </div>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/tile/index.js";
import "@carbon/web-components/es/components/text-input/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/progress-indicator/index.js";
import "@carbon/web-components/es/components/notification/index.js";

import tearsheetsSharedState from "@/stores/experimentTearsheetSharedState.js";
import { progressStepOverflowFix } from "@/functions/progress_indicator_step_overflow_fix";

import { DatashimDatasetConfiguration } from "@/classes/DatashimDatasetConfiguration.js";
import {
  FileConfiguration,
  FileConfigurationFromDatashim,
} from "@/classes/FileConfiguration";
import DatashimAddModifyDatasets from "@/components/ExperimentView/DatashimAddModifyDatasets.vue";

export default {
  name: "InputConfigurationDatashimForm",
  emits: [
    "disable-tearsheet-primary-action",
    "disable-tearsheet-secondary-action",
    "form-page-update",
    "push-to-toast-errors",
    "toggle-primary-action-text",
    "input-configuration-update",
  ],
  props: {
    pageNo: {
      type: Number,
      default: 0,
    },
    fileConfiguration: {
      type: FileConfiguration,
      default: new FileConfiguration(),
    },
  },
  components: {
    DatashimAddModifyDatasets,
  },
  data() {
    return {
      pageNumber: this.pageNo,
      loading: true,
      isInEdit: false,
      fileName: "",
      datasetConfigurations:
        tearsheetsSharedState.datashimDatasetConfigurations,
      datasetToEdit: new DatashimDatasetConfiguration(),
      lastSelectedDatashimTile: new DatashimDatasetConfiguration(),
      endpointConfigurationFormOpen:
        tearsheetsSharedState.datashimDatasetConfigurations.length == 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      /*
        AP (08/10/2024): Hack required due to overflow hiding text even when spaced equally
        Issue: https://github.ibm.com/st4sd/st4sd-registry-ui/issues/832
      */
      progressStepOverflowFix("addDatasetsStep");
      progressStepOverflowFix("datasetConfigurationStep");
    });
    this.loading = false;
  },
  methods: {
    updateButtonStatuses() {
      let primaryActionTextValue = false;
      let disableTearsheetPrimaryActionValue = false;
      let disableTearsheetSecondaryActionValue = false;

      if (this.pageNumber == 0) {
        // On page 0 (where the user can create/edit/select Dataset configuration)
        // The primary button should be "Next" and it should be enabled only if:
        // - The user has selected a dataset configuration
        // - The dataset selected is valid
        // The secondary button should not be enabled
        primaryActionTextValue = false;
        disableTearsheetPrimaryActionValue =
          !this.lastSelectedDatashimTile.isValid();
        disableTearsheetSecondaryActionValue = true;
      } else {
        // On page 1 (where the user provides a file name)
        // The secondary button should be enabled.
        // The primary button should be "Submit" and it should be enabled
        primaryActionTextValue = true;
        disableTearsheetPrimaryActionValue = !this.fileName?.trim() != "";
        disableTearsheetSecondaryActionValue = false;
      }

      this.$emit("toggle-primary-action-text", primaryActionTextValue);
      this.$emit(
        "disable-tearsheet-primary-action",
        disableTearsheetPrimaryActionValue,
      );
      this.$emit(
        "disable-tearsheet-secondary-action",
        disableTearsheetSecondaryActionValue,
      );
    },
    updateProgressIndicatorStatus() {
      /*
        AP (09/10/2024): This is required because of
        https://github.com/carbon-design-system/carbon-for-ibm-dotcom/issues/11891
        Due to the nature of the issue, states for progress indicators cannot
        be set normally.
      */
      let addConnectionStep = document.getElementById("addDatasetsStep");
      let datasetConfigurationStep = document.getElementById(
        "datasetConfigurationStep",
      );
      if (this.pageNumber == 0) {
        addConnectionStep.setAttribute("state", "current");
        datasetConfigurationStep.setAttribute("state", "incomplete");
      } else {
        addConnectionStep.setAttribute("state", "complete");
        datasetConfigurationStep.setAttribute("state", "current");
      }
    },
    updateRadioTileGroupSelection(event) {
      // With the radio tile group, clicking within the group
      // but outside of the tile will have undefined as value.
      // This would break our validation
      if (event.detail.target.value) {
        this.lastSelectedDatashimTile = event.detail.target.value;
      }
    },
    updateDatasetConfiguration(datashim) {
      tearsheetsSharedState.updateDatashimDatasetConfiguration(datashim);
      this.isInEdit = false;
    },
    editDatasetConfiguration(datashim) {
      this.datasetToEdit = datashim;
      this.isInEdit = true;
    },
    addNewDatasetConfiguration(obj) {
      tearsheetsSharedState.addDatashimDatasetConfiguration(obj);
    },
    deleteDatasetConfiguration(idx) {
      let fileReferencesForDatashim =
        tearsheetsSharedState.getFileReferencesForDatashimDatasetConfiguration(
          this.datasetConfigurations[idx].id,
        );

      if (fileReferencesForDatashim.size == 0) {
        this.isInEdit = false;
        tearsheetsSharedState.removeDatashimDatasetConfigurationByIndex(idx);
        this.lastSelectedDatashimTile = new DatashimDatasetConfiguration();
        return;
      }

      this.$emit("push-to-toast-errors", {
        description:
          "ERROR: Cannot remove a Dataset that is referenced by one or more files.",
        statusText:
          "References: " + Array.from(fileReferencesForDatashim).join(", "),
        code: 403,
      });
    },
  },
  watch: {
    pageNo: {
      immediate: true,
      handler(newPage) {
        this.pageNumber = newPage;
        this.$nextTick(() => {
          this.updateButtonStatuses();
          this.updateProgressIndicatorStatus();
        });
      },
    },
    fileConfiguration: {
      deep: true,
      immediate: true,
      handler(newFileConfiguration) {
        // Directly show 2nd page if we are editing
        if (newFileConfiguration instanceof FileConfigurationFromDatashim) {
          this.lastSelectedDatashimTile =
            tearsheetsSharedState.datashimDatasetConfigurations.find(
              (datashim) => {
                return datashim.id == newFileConfiguration.datasetId;
              },
            );
          this.fileName = newFileConfiguration.fileName;
          this.pageNumber = 1;
        } else {
          this.pageNumber = 0;
          this.datasetConfigurations =
            tearsheetsSharedState.datashimDatasetConfigurations;
          this.lastSelectedDatashimTile = new DatashimDatasetConfiguration();
        }

        // As we might change the page we are showing based on the file configuration
        // we need to emit an update to inform the FileConfigurationTearsheet
        this.$emit("form-page-update", this.pageNumber);
        this.$emit("input-configuration-update", newFileConfiguration);
        this.$nextTick(() => {
          this.updateButtonStatuses();
          this.updateProgressIndicatorStatus();
        });
      },
    },
    fileName: {
      immediate: true,
      handler(newFileName) {
        // Emit updates every time we get a new value for the file name
        if (newFileName?.trim() != "") {
          this.$emit(
            "input-configuration-update",
            new FileConfigurationFromDatashim(
              this.lastSelectedDatashimTile.id,
              this.lastSelectedDatashimTile.name,
              newFileName,
            ),
          );
        } else {
          this.$emit("input-configuration-update", new FileConfiguration());
        }
        this.$nextTick(() => {
          this.updateButtonStatuses();
          this.updateProgressIndicatorStatus();
        });
      },
    },
    lastSelectedDatashimTile(datashim) {
      this.$emit("disable-tearsheet-primary-action", !datashim.isValid());
    },
    pageNumber(page) {
      this.$emit("form-page-update", page);
    },
  },
};
</script>

<style scoped lang="scss">
@use "@carbon/layout";
@use "@carbon/grid";

cds-progress-indicator {
  padding-bottom: layout.$spacing-05;
}

cds-text-input {
  padding: layout.$spacing-05 0;
}
</style>
