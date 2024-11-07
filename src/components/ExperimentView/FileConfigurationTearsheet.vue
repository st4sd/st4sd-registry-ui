<template>
  <cds-tearsheet
    class="cds-theme-zone-g10"
    :open="isOpen"
    data-index="two"
    hasCloseIcon
    width="wide"
    @cds-tearsheet-closed="$emit('cds-tearsheet-closed')"
  >
    <h3 slot="title">Provide a file for {{ fileName }}</h3>
    <p slot="description">
      Use the tabs to choose how you want to provide the file.
    </p>
    <div slot="header-navigation">
      <!--
        Due to the nature of the components, a variable is used 
        to determine which tab is open instead of targets/ids.
        This is because we need to only render one component at
        a time to avoid passing things like fileConfigurations to
        multiple components at the same time, causing issues.
      -->
      <cds-tabs :value="activePanel">
        <cds-tab
          v-for="option in options"
          :value="option.option"
          @click="
            () => {
              if (!option.isDisabled) this.activePanel = option.option;
            }
          "
          :disabled="option.isDisabled"
          >{{ option.option }}</cds-tab
        >
      </cds-tabs>
    </div>
    <div
      v-if="activePanel == experimentTearsheetTabEnums.UPLOAD"
      role="tabpanel"
    >
      <InputConfigurationFileUploadForm
        :fileConfiguration="fileConfiguration"
        @input-configuration-update="userFileConfiguration = $event"
        @disable-tearsheet-primary-action="primaryButtonDisabled = $event"
      />
    </div>
    <div
      v-else-if="activePanel == experimentTearsheetTabEnums.S3"
      role="tabpanel"
    >
      <InputConfigurationS3Form
        :fileConfiguration="fileConfiguration"
        :pageNo="s3FormPage"
        @toggle-primary-action-text="primaryButtonIsSubmit = $event"
        @disable-tearsheet-primary-action="primaryButtonDisabled = $event"
        @disable-tearsheet-secondary-action="secondaryButtonDisabled = $event"
        @input-configuration-update="userFileConfiguration = $event"
        @push-to-toast-errors="$emit('push-to-toast-errors', $event)"
        @form-page-update="s3FormPage = $event"
      />
    </div>
    <div
      v-else-if="activePanel == experimentTearsheetTabEnums.PVC"
      role="tabpanel"
    >
      PVC TAB
    </div>
    <div
      v-else-if="activePanel == experimentTearsheetTabEnums.DATASHIM"
      role="tabpanel"
    >
      DATASHIM TAB
    </div>
    <div
      v-else-if="
        activePanel == experimentTearsheetTabEnums.APPLICATION_DEPENDENCIES
      "
      role="tabpanel"
    >
      APPLICATION DEPENDENCIES TAB
    </div>
    <cds-button
      slot="actions"
      kind="ghost"
      @click="$emit('cds-tearsheet-closed')"
      >Cancel</cds-button
    >
    <cds-button
      slot="actions"
      kind="secondary"
      :disabled="secondaryButtonDisabled"
      @click="secondaryButtonClicked()"
      >Back</cds-button
    >
    <cds-button
      slot="actions"
      kind="primary"
      :disabled="primaryButtonDisabled"
      @click="primaryButtonClicked()"
      >{{ primaryButtonIsSubmit ? "Submit" : "Next" }}</cds-button
    >
  </cds-tearsheet>
</template>

<script>
import "@carbon/web-components/es/components/tearsheet/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/tabs/index.js";
import InputConfigurationS3Form from "@/components/ExperimentView/InputConfigurationS3Form.vue";
import InputConfigurationFileUploadForm from "@/components/ExperimentView/InputConfigurationFileUploadForm.vue";
import experimentTearsheetTabEnums from "@/enums/experimentTearsheetTabEnums";

import { tearsheetsSharedState } from "@/stores/experimentTearsheetSharedState.js";

import {
  FileConfiguration,
  FileConfigurationFromUpload,
  FileConfigurationFromS3,
} from "@/classes/FileConfiguration.js";

export default {
  name: "FileConfigurationTearsheet",
  props: {
    fileName: String,
    fileConfiguration: {
      type: FileConfiguration,
      default: new FileConfiguration(),
    },
    isOpen: Boolean,
  },
  emits: ["cds-tearsheet-closed", "push-to-toast-errors"],
  components: {
    InputConfigurationFileUploadForm,
    InputConfigurationS3Form,
  },
  data() {
    return {
      experimentTearsheetTabEnums,
      primaryButtonIsSubmit: true,
      userFileConfiguration: FileConfiguration,
      options: [
        {
          option: experimentTearsheetTabEnums.UPLOAD,
          isDisabled: false,
          hasSingleStep: true,
        },
        {
          option: experimentTearsheetTabEnums.S3,
          isDisabled: false,
          hasSingleStep: false,
        },
        {
          option: experimentTearsheetTabEnums.PVC,
          isDisabled: true,
          hasSingleStep: true,
        },
        {
          option: experimentTearsheetTabEnums.DATASHIM,
          isDisabled: true,
          hasSingleStep: true,
        },
        {
          option: experimentTearsheetTabEnums.APPLICATION_DEPENDENCIES,
          isDisabled: true,
          hasSingleStep: true,
        },
      ],
      secondaryButtonDisabled: true,
      primaryButtonDisabled: true,
      activePanel: this.getOpenTab(),
      s3FormPage: 0,
    };
  },
  components: {
    InputConfigurationS3Form,
    InputConfigurationFileUploadForm,
  },
  watch: {
    activePanel(panel) {
      this.primaryButtonIsSubmit = this.options.find(
        (option) => option.option == panel,
      ).hasSingleStep;
    },
    isOpen() {
      this.activePanel = this.getOpenTab();
    },
  },
  methods: {
    handlePageUpdate(event) {
      this.s3FormPage = event;
    },
    getOpenTab() {
      switch (this.fileConfiguration.constructor) {
        case FileConfigurationFromUpload:
          return experimentTearsheetTabEnums.UPLOAD;
        case FileConfigurationFromS3:
          return experimentTearsheetTabEnums.S3;
        default:
          return experimentTearsheetTabEnums.UPLOAD;
      }
    },
    primaryButtonClicked() {
      switch (this.activePanel) {
        case experimentTearsheetTabEnums.UPLOAD:
          this.primaryButtonDisabled = true;
          this.secondaryButtonDisabled = false;
          tearsheetsSharedState.setConfigurationForFile(
            this.fileName,
            this.userFileConfiguration,
          );
          this.$emit("cds-tearsheet-closed");
          return;
        case experimentTearsheetTabEnums.S3:
          if (
            this.s3FormPage == 1 &&
            this.userFileConfiguration instanceof FileConfigurationFromS3
          ) {
            tearsheetsSharedState.setConfigurationForFile(
              this.fileName,
              this.userFileConfiguration,
            );
            this.$emit("cds-tearsheet-closed");
          }
          this.s3FormPage = this.s3FormPage == 0 ? 1 : 0;
          return;
      }
    },
    secondaryButtonClicked() {
      if (this.activePanel == experimentTearsheetTabEnums.S3) {
        this.s3FormPage = 0;
      }
    },
  },
};
</script>
