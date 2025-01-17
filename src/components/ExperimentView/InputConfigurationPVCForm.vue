<template>
  <div v-if="loading">LOADING</div>
  <div v-else>
    <div class="cds--subgrid">
      <cds-progress-indicator
        spaceEqually
        class="cds--css-grid-column cds--col-span-100"
      >
        <cds-progress-step
          id="addPVCStep"
          label="Add PVC Entry"
          @click="pageNumber = 0"
        ></cds-progress-step>
        <cds-progress-step
          id="subPathStep"
          label="PVC Entry reference"
          :disabled="!lastSelectedPVCTile.isValid()"
          @click="pageNumber = 1"
        ></cds-progress-step>
      </cds-progress-indicator>
    </div>
    <div v-if="pageNumber == 0" class="cds--subgrid cds--subgrid--wide">
      <div
        class="cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-8"
      >
        <cds-tile
          class="cds-theme-zone-white"
          v-if="pvcConfigurations.length == 0"
        >
          <p><strong> No PVC entries configured.</strong></p>
          <p>Add a new PVC entry to continue.</p>
        </cds-tile>
        <div v-else>
          <cds-tile-group
            @cds-current-radio-tile-selection="updateRadioTileGroupSelection"
          >
            <cds-radio-tile
              v-for="(entry, idx) in pvcConfigurations"
              :value="entry"
              :selected="entry.id == lastSelectedPVCTile.id"
            >
              <cds-button
                size="md"
                kind="danger-ghost"
                style="position: absolute; bottom: 10px; right: 100px"
                title="Delete PVC Entry"
                @click="deletePVCEntry(idx)"
              >
                <img
                  slot="icon"
                  width="16"
                  height="16"
                  src="@/assets/trash-can.svg"
                />
              </cds-button>
              <cds-button
                size="md"
                kind="ghost"
                style="position: absolute; bottom: 10px; right: 150px"
                title="Edit PVC Entry"
                :disabled="this.isInEdit"
                @click="editPVCEntry(entry)"
              >
                <img
                  slot="icon"
                  class="black-svg"
                  width="16"
                  height="16"
                  src="@/assets/edit.svg"
                />
              </cds-button>
              Name: {{ entry.name }}
            </cds-radio-tile></cds-tile-group
          >
        </div>
      </div>
      <div
        class="cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-8"
      >
        <cds-tile>
          <p>{{ isInEdit ? "Edit PVC Entry" : "Add a new PVC Entry" }}</p>

          <cds-inline-notification
            v-if="isInEdit"
            title="Be careful."
            subtitle="Changing the PVC name here will change it for all files referencing it."
            low-contrast
            hide-close-button
            kind="warning"
          >
          </cds-inline-notification>

          <PVCFormNewEntry
            :isInEditMode="isInEdit"
            :pvcEditEntry="pvcToEdit"
            @add-new-pvc-entry="addNewPVCEntry($event)"
            @edit-pvc-entry="updatePVCEntry($event, idx)"
            @cancel-edit="isInEdit = false"
          />
        </cds-tile>
      </div>
    </div>
    <div class="cds--subgrid cds--subgrid--wide" v-else>
      <div
        class="cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-8"
      >
        <cds-tile-group>
          <cds-radio-tile selected :value="lastSelectedPVCTile"
            >Name: {{ lastSelectedPVCTile.name }}</cds-radio-tile
          >
        </cds-tile-group>
      </div>
      <cds-tile
        class="cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-8"
        style="padding-bottom: 32px"
      >
        <p>Configure your input file</p>
        <cds-form-group>
          <cds-text-input
            :value="fileName"
            @input="fileName = $event.target.value"
            label="File name"
          />
          <br />
          <cds-text-input
            :value="subPath"
            @input="subPath = $event.target.value"
            label="PVC sub path (optional)"
          /> </cds-form-group
      ></cds-tile>
    </div>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/tile/index.js";
import "@carbon/web-components/es/components/text-input/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/progress-indicator/index.js";
import "@carbon/web-components/es/components/notification/index.js";
import "@carbon/web-components/es/components/form-group/index.js";

import tearsheetsSharedState from "@/stores/experimentTearsheetSharedState.js";
import { progressStepOverflowFix } from "@/functions/progress_indicator_step_overflow_fix";
import PVCFormNewEntry from "./PVCFormNewEntry.vue";
import { PVCConfiguration } from "@/classes/PVCConfiguration";
import {
  FileConfiguration,
  FileConfigurationFromPVC,
} from "@/classes/FileConfiguration";

export default {
  name: "InputConfigurationPVCForm",
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
  components: { PVCFormNewEntry },
  emits: [
    "disable-tearsheet-primary-action",
    "disable-tearsheet-secondary-action",
    "form-page-update",
    "push-to-toast-errors",
    "toggle-primary-action-text",
    "input-configuration-update",
  ],
  data() {
    return {
      pvcConfigurations: tearsheetsSharedState.pvcConfigurations,
      pageNumber: this.pageNo,
      pvcToEdit: new PVCConfiguration(),
      lastSelectedPVCTile: new PVCConfiguration(),
      isInEdit: false,
      subPath: "",
      pvcValid: false,
      loading: true,
      fileName: "",
      pvcConfigurationFormOpen:
        tearsheetsSharedState.pvcConfigurations.length == 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      /*
        AP (08/10/2024): Hack required due to overflow hiding text even when spaced equally
        Issue: https://github.ibm.com/st4sd/st4sd-registry-ui/issues/832
      */
      progressStepOverflowFix("addPVCStep");
      progressStepOverflowFix("subPathStep");
    });
    this.loading = false;
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
        if (newFileConfiguration instanceof FileConfigurationFromPVC) {
          this.lastSelectedPVCTile =
            tearsheetsSharedState.pvcConfigurations.get(
              newFileConfiguration.pvcId,
            );
          this.fileName = newFileConfiguration.fileName;
          this.subPath = newFileConfiguration.subPath;
          this.pageNumber = 1;
        } else {
          this.pageNumber = 0;
          this.pvcConfigurations = tearsheetsSharedState.pvcConfigurations;
          this.lastSelectedPVCTile = new PVCConfiguration();
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
    subPath: {
      immediate: true,
      handler(path) {
        if (this.fileName?.trim() != "") {
          this.$emit(
            "input-configuration-update",
            new FileConfigurationFromPVC(
              this.lastSelectedPVCTile.id,
              this.lastSelectedPVCTile.name,
              this.fileName,
              path,
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
    fileName: {
      immediate: true,
      handler(name) {
        if (name?.trim() != "") {
          this.$emit(
            "input-configuration-update",
            new FileConfigurationFromPVC(
              this.lastSelectedPVCTile.id,
              this.lastSelectedPVCTile.name,
              name,
              this.subPath,
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
    lastSelectedPVCTile(entry) {
      this.$emit("disable-tearsheet-primary-action", !entry.isValid());
    },
    pageNumber(page) {
      this.$emit("form-page-update", page);
    },
  },
  methods: {
    updateButtonStatuses() {
      let primaryActionTextValue = false;
      let disableTearsheetPrimaryActionValue = false;
      let disableTearsheetSecondaryActionValue = false;

      if (this.pageNumber == 0) {
        // On page 0 (where the user can create/edit/select PVC entries)
        // The primary button should be "Next" and it should be enabled only if:
        // - The user has selected an PVC entry
        // - The PVC entry selected is valid
        // The secondary button should not be enabled
        primaryActionTextValue = false;
        disableTearsheetPrimaryActionValue =
          !this.lastSelectedPVCTile.isValid();
        disableTearsheetSecondaryActionValue = true;
      } else {
        // On page 1 (where the user provides an optional sub path)
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
      let addPVCStep = document.getElementById("addPVCStep");
      let pvcEntryStep = document.getElementById("subPathStep");
      if (this.pageNumber == 0) {
        addPVCStep.setAttribute("state", "current");
        pvcEntryStep.setAttribute("state", "incomplete");
      } else {
        addPVCStep.setAttribute("state", "complete");
        pvcEntryStep.setAttribute("state", "current");
      }
    },
    updateRadioTileGroupSelection(event) {
      // With the radio tile group, clicking within the group
      // but outside of the tile will have undefined as value.
      // This would break our validation
      if (event.detail.target.value) {
        this.lastSelectedPVCTile = event.detail.target.value;
      }
    },
    updatePVCEntry(pvc) {
      tearsheetsSharedState.updatePVCEntry(pvc);
      this.isInEdit = false;
    },
    editPVCEntry(pvc) {
      this.pvcToEdit = pvc;
      this.isInEdit = true;
    },
    addNewPVCEntry(obj) {
      tearsheetsSharedState.addPVCEntry(obj);
    },
    deletePVCEntry(idx) {
      let fileReferencesForEntry =
        tearsheetsSharedState.getFileReferencesForPVCEntry(
          this.pvcConfigurations[idx].id,
        );

      if (fileReferencesForEntry.size == 0) {
        this.isInEdit = false;
        tearsheetsSharedState.removePVCEntryByIndex(idx);
        this.lastSelectedPVCTile = new PVCConfiguration();
        return;
      }

      this.$emit("push-to-toast-errors", {
        description:
          "ERROR: Cannot remove a PVC Entry that is referenced by one or more files.",
        statusText:
          "References: " + Array.from(fileReferencesForEntry).join(", "),
        code: 403,
      });
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

cds-inline-notification {
  margin-top: layout.$spacing-05;
}

cds-text-input {
  padding: layout.$spacing-05 0;
}
</style>
