<template>
  <div v-if="loading">LOADING</div>
  <div v-else>
    <div class="cds--subgrid">
      <cds-progress-indicator
        spaceEqually
        class="cds--css-grid-column cds--col-span-100"
      >
        <cds-progress-step
          id="addConnectionsStep"
          label="Add connections"
          @click="pageNumber = 0"
        ></cds-progress-step>
        <cds-progress-step
          id="s3ConfigurationStep"
          label="S3 Configuration"
          :disabled="!lastSelectedEndpointTile.isValid()"
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
          v-if="s3Configurations.length == 0"
        >
          <p><strong> No S3 connections configured.</strong></p>
          <p>Add a new S3 configuration to continue.</p>
        </cds-tile>
        <div v-else>
          <cds-tile-group
            @cds-current-radio-tile-selection="updateRadioTileGroupSelection"
          >
            <cds-radio-tile
              v-for="(endpoint, idx) in s3Configurations"
              :value="endpoint"
              :selected="endpoint.id == lastSelectedEndpointTile.id"
            >
              <cds-button
                size="md"
                kind="danger-ghost"
                style="position: absolute; right: 100px"
                title="Delete endpoint"
                @click="deleteS3Connection(idx)"
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
                style="position: absolute; right: 150px"
                title="Edit endpoint"
                :disabled="this.isInEdit"
                @click="editS3Connection(endpoint)"
              >
                <img
                  slot="icon"
                  class="black-svg"
                  width="16"
                  height="16"
                  src="@/assets/edit.svg"
                />
              </cds-button>
              Endpoint: {{ endpoint.endpoint }}
              <br />
              Name: {{ endpoint.name }}
            </cds-radio-tile></cds-tile-group
          >
        </div>
      </div>
      <div
        class="cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-8"
      >
        <cds-tile>
          <p>
            {{
              isInEdit ? "Edit S3 Configuration" : "Add a new S3 Configuration"
            }}
          </p>

          <cds-inline-notification
            v-if="s3Configurations.length != 0 && !isInEdit"
            title="Only one S3 configuration is allowed."
            subtitle="You can only delete or edit the available configuration."
            low-contrast
            hide-close-button
            kind="warning"
          >
          </cds-inline-notification>
          <cds-inline-notification
            v-else-if="isInEdit"
            title="Be careful."
            subtitle="Changing the S3 configuration here will change it for all files referencing it."
            low-contrast
            hide-close-button
            kind="warning"
          >
          </cds-inline-notification>

          <S3FormNewEndpoint
            :isInEditMode="isInEdit"
            :s3EditEndpoint="endpointToEdit"
            :disableForm="s3Configurations.length != 0 && !isInEdit"
            @add-new-s3-endpoint="addNewS3Connection($event)"
            @edit-s3-endpoint="updateS3Connection($event, idx)"
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
          <cds-radio-tile selected :value="lastSelectedEndpointTile"
            >Endpoint: {{ lastSelectedEndpointTile.endpoint }}
            <br />
            Name: {{ lastSelectedEndpointTile.name }}</cds-radio-tile
          >
        </cds-tile-group>
      </div>
      <cds-tile
        class="cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-8"
        style="padding-bottom: 32px"
      >
        <p>Provide an S3 URI</p>
        <cds-text-input
          :value="s3Uri"
          @input="s3Uri = $event.target.value"
          :invalid="!isS3UriValid"
          :invalidText="`Format: s3://${lastSelectedEndpointTile.bucket}/[<path>/]<file>`"
          class="s3UriInput"
          label="S3 URI"
        />
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
import S3FormNewEndpoint from "./S3FormNewEndpoint.vue";
import S3Configuration from "@/classes/S3Configuration";
import {
  FileConfiguration,
  FileConfigurationFromS3,
} from "@/classes/FileConfiguration";

export default {
  name: "InputConfigurationS3Form",
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
    S3FormNewEndpoint,
  },
  data() {
    return {
      isS3UriValid: true,
      pageNumber: this.pageNo,
      loading: true,
      isInEdit: false,
      s3Uri: "",
      s3Configurations: tearsheetsSharedState.s3Configurations,
      endpointToEdit: new S3Configuration(),
      lastSelectedEndpointTile: new S3Configuration(),
      endpointConfigurationFormOpen:
        tearsheetsSharedState.s3Configurations.length == 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      /*
        AP (08/10/2024): Hack required due to overflow hiding text even when spaced equally
        Issue: https://github.ibm.com/st4sd/st4sd-registry-ui/issues/832
      */
      progressStepOverflowFix("addConnectionsStep");
      progressStepOverflowFix("s3ConfigurationStep");
    });
    this.loading = false;
  },
  methods: {
    updateButtonStatuses() {
      let primaryActionTextValue = false;
      let disableTearsheetPrimaryActionValue = false;
      let disableTearsheetSecondaryActionValue = false;

      if (this.pageNumber == 0) {
        // On page 0 (where the user can create/edit/select S3 configuration)
        // The primary button should be "Next" and it should be enabled only if:
        // - The user has selected an endpoint
        // - The endpoint selected is valid
        // The secondary button should not be enabled
        primaryActionTextValue = false;
        disableTearsheetPrimaryActionValue =
          !this.lastSelectedEndpointTile.isValid();
        disableTearsheetSecondaryActionValue = true;
      } else {
        // On page 1 (where the user provides an S3 URI)
        // The primary button should be "Submit" and it should be enabled if
        // - The S3URI, when trimmed, is not empty
        // - When validated using a RegEx, it has the correct fields, namely:
        //     - bucket
        //     - path (optional, not validated here)
        //     - file
        // The secondary button should always be enabled.
        let s3UriValidation = tearsheetsSharedState.s3UriRegex.exec(this.s3Uri);
        this.isS3UriValid =
          this.s3Uri?.trim() != "" &&
          s3UriValidation?.groups.bucket ==
            this.lastSelectedEndpointTile.bucket &&
          s3UriValidation?.groups.file;
        primaryActionTextValue = true;
        disableTearsheetPrimaryActionValue = !this.isS3UriValid;
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
      let addConnectionStep = document.getElementById("addConnectionsStep");
      let s3ConfigurationStep = document.getElementById("s3ConfigurationStep");
      if (this.pageNumber == 0) {
        addConnectionStep.setAttribute("state", "current");
        s3ConfigurationStep.setAttribute("state", "incomplete");
      } else {
        addConnectionStep.setAttribute("state", "complete");
        s3ConfigurationStep.setAttribute("state", "current");
      }
    },
    updateRadioTileGroupSelection(event) {
      // With the radio tile group, clicking within the group
      // but outside of the tile will have undefined as value.
      // This would break our validation
      if (event.detail.target.value) {
        this.lastSelectedEndpointTile = event.detail.target.value;
      }
    },
    updateS3Connection(endpoint) {
      tearsheetsSharedState.updateS3Endpoint(endpoint);
      this.isInEdit = false;
    },
    editS3Connection(endpoint) {
      this.endpointToEdit = endpoint;
      this.isInEdit = true;
    },
    addNewS3Connection(obj) {
      tearsheetsSharedState.addS3Endpoint(obj);
    },
    deleteS3Connection(idx) {
      let fileReferencesForEndpoint =
        tearsheetsSharedState.getFileReferencesForS3Endpoint(
          this.s3Configurations[idx].id,
        );

      if (fileReferencesForEndpoint.size == 0) {
        this.isInEdit = false;
        tearsheetsSharedState.removeS3EndpointByIndex(idx);
        this.lastSelectedEndpointTile = new S3Configuration();
        return;
      }

      this.$emit("push-to-toast-errors", {
        description:
          "ERROR: Cannot remove an endpoint that is referenced by one or more files.",
        statusText:
          "References: " + Array.from(fileReferencesForEndpoint).join(", "),
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
        if (newFileConfiguration instanceof FileConfigurationFromS3) {
          this.lastSelectedEndpointTile =
            tearsheetsSharedState.s3Configurations.find(
              (endpoint) => endpoint.id == newFileConfiguration.endpointId,
            );
          this.s3Uri = newFileConfiguration.uri;
          this.pageNumber = 1;
        } else {
          this.pageNumber = 0;
          this.s3Configurations = tearsheetsSharedState.s3Configurations;
          this.lastSelectedEndpointTile = new S3Configuration();
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
    s3Uri: {
      immediate: true,
      handler(newUri) {
        let s3UriValidation = tearsheetsSharedState.s3UriRegex.exec(this.s3Uri);
        // Emit updates every time we get a new value for the URI
        if (
          newUri?.trim() != "" &&
          s3UriValidation?.groups.bucket &&
          s3UriValidation?.groups.file
        ) {
          this.$emit(
            "input-configuration-update",
            new FileConfigurationFromS3(
              this.lastSelectedEndpointTile.id,
              newUri,
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
    lastSelectedEndpointTile(endpoint) {
      this.$emit("disable-tearsheet-primary-action", !endpoint.isValid());
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

cds-inline-notification {
  margin-top: layout.$spacing-05;
}

cds-text-input {
  padding: layout.$spacing-05 0;
}

.s3UriInput {
  position: relative;
  top: 22px;
}
</style>
