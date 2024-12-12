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
      <InputConfigurationPVCForm
        :fileConfiguration="fileConfiguration"
        :pageNo="pvcFormPage"
        @toggle-primary-action-text="primaryButtonIsSubmit = $event"
        @disable-tearsheet-primary-action="primaryButtonDisabled = $event"
        @disable-tearsheet-secondary-action="secondaryButtonDisabled = $event"
        @input-configuration-update="userFileConfiguration = $event"
        @push-to-toast-errors="$emit('push-to-toast-errors', $event)"
        @form-page-update="pvcFormPage = $event"
      />
    </div>
    <div
      v-else-if="activePanel == experimentTearsheetTabEnums.DATASHIM"
      role="tabpanel"
    >
      <InputConfigurationDatashimForm
        :fileConfiguration="fileConfiguration"
        :pageNo="datashimFormPage"
        @toggle-primary-action-text="primaryButtonIsSubmit = $event"
        @disable-tearsheet-primary-action="primaryButtonDisabled = $event"
        @disable-tearsheet-secondary-action="secondaryButtonDisabled = $event"
        @input-configuration-update="userFileConfiguration = $event"
        @push-to-toast-errors="$emit('push-to-toast-errors', $event)"
        @form-page-update="datashimFormPage = $event"
      />
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
import InputConfigurationPVCForm from "@/components/ExperimentView/InputConfigurationPVCForm.vue";
import InputConfigurationDatashimForm from "@/components/ExperimentView/InputConfigurationDatashimForm.vue";

import experimentTearsheetTabEnums from "@/enums/experimentTearsheetTabEnums";

import { tearsheetsSharedState } from "@/stores/experimentTearsheetSharedState.js";

import {
  FileConfiguration,
  FileConfigurationFromUpload,
  FileConfigurationFromS3,
  FileConfigurationFromPVC,
  FileConfigurationFromDatashim,
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
    InputConfigurationPVCForm,
    InputConfigurationDatashimForm,
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
          isDisabled: false,
          hasSingleStep: false,
        },
        {
          option: experimentTearsheetTabEnums.DATASHIM,
          isDisabled: false,
          hasSingleStep: false,
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
      pvcFormPage: 0,
      datashimFormPage: 0,
    };
  },
  watch: {
    activePanel(panel) {
      this.primaryButtonIsSubmit = this.options.find(
        (option) => option.option == panel,
      ).hasSingleStep;
    },
    isOpen() {
      this.ensureDatashimAndS3TabsMutuallyExclusive();
      this.activePanel = this.getOpenTab();
    },
  },
  methods: {
    ensureDatashimAndS3TabsMutuallyExclusive() {
      const S3_TAB_IDX = 1;
      const DATASHIM_TAB_IDX = 3;

      let filesConfiguredFromS3 = [];
      let filesConfiguredFromDatashim = [];
      for (let file of Array.from(tearsheetsSharedState.files.values())) {
        if (file instanceof FileConfigurationFromS3)
          filesConfiguredFromS3.push(file);
        else if (file instanceof FileConfigurationFromDatashim)
          filesConfiguredFromDatashim.push(file);
      }

      // There are three cases in which both the S3 and the Datashim tabs are enabled:
      // - There are no files configured to use S3 or Datashim
      // - The current file is of type S3 and no other file is from S3
      // - The current file is of type Datashim and no other file is from Datashim
      if (
        (filesConfiguredFromDatashim.length == 0 &&
          filesConfiguredFromS3.length == 0) ||
        (this.fileConfiguration instanceof FileConfigurationFromS3 &&
          filesConfiguredFromS3.length == 1) ||
        (this.fileConfiguration instanceof FileConfigurationFromDatashim &&
          filesConfiguredFromDatashim.length == 1)
      ) {
        this.options[DATASHIM_TAB_IDX].isDisabled = false;
        this.options[S3_TAB_IDX].isDisabled = false;
        return;
      }

      // Now that there is no case where both tabs should be enabled.
      if (filesConfiguredFromS3.length > 0)
        this.options[DATASHIM_TAB_IDX].isDisabled = true;
      else if (filesConfiguredFromDatashim.length > 0)
        this.options[S3_TAB_IDX].isDisabled = true;
    },
    getOpenTab() {
      switch (this.fileConfiguration.constructor) {
        case FileConfigurationFromUpload:
          return experimentTearsheetTabEnums.UPLOAD;
        case FileConfigurationFromS3:
          return experimentTearsheetTabEnums.S3;
        case FileConfigurationFromPVC:
          return experimentTearsheetTabEnums.PVC;
        case FileConfigurationFromDatashim:
          return experimentTearsheetTabEnums.DATASHIM;
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
        case experimentTearsheetTabEnums.PVC:
          if (
            this.pvcFormPage == 1 &&
            this.userFileConfiguration instanceof FileConfigurationFromPVC
          ) {
            tearsheetsSharedState.setConfigurationForFile(
              this.fileName,
              this.userFileConfiguration,
            );
            this.$emit("cds-tearsheet-closed");
          }
          this.pvcFormPage = this.pvcFormPage == 0 ? 1 : 0;
          return;
        case experimentTearsheetTabEnums.DATASHIM:
          if (
            this.datashimFormPage == 1 &&
            this.userFileConfiguration instanceof FileConfigurationFromDatashim
          ) {
            tearsheetsSharedState.setConfigurationForFile(
              this.fileName,
              this.userFileConfiguration,
            );
            this.$emit("cds-tearsheet-closed");
          }
          this.datashimFormPage = this.datashimFormPage == 0 ? 1 : 0;
      }
    },
    secondaryButtonClicked() {
      if (this.activePanel == experimentTearsheetTabEnums.S3) {
        this.s3FormPage = 0;
      } else if (this.activePanel == experimentTearsheetTabEnums.PVC) {
        this.pvcFormPage = 0;
      } else if (this.activePanel == experimentTearsheetTabEnums.DATASHIM) {
        this.datashimFormPage = 0;
      }
    },
  },
};
</script>
