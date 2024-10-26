<template>
  <p><strong>Upload files from your local machine</strong></p>
  <p>Only one file can be uploaded.</p>
  <cds-file-uploader>
    <cds-file-uploader-drop-container
      :disabled="disableContainer"
      @cds-file-uploader-drop-container-changed="handleFileUpload"
    >
      Drag and drop files here or click to upload
    </cds-file-uploader-drop-container>
    <cds-file-uploader-item
      v-if="currentFileConfiguration.file"
      :state="currentFileConfiguration.file ? 'edit' : 'uploaded'"
      @cds-file-uploader-item-deleted="handleFileDeletion"
      >{{ currentFileConfiguration.file.name }}</cds-file-uploader-item
    >
  </cds-file-uploader>
</template>

<script>
import "@carbon/web-components/es/components/file-uploader/index.js";
import {
  FileConfiguration,
  FileConfigurationFromUpload,
} from "@/classes/FileConfiguration.js";

export default {
  name: "InputConfigurationFileUploadForm",
  emits: ["input-configuration-update", "disable-tearsheet-primary-action"],
  props: {
    fileConfiguration: FileConfiguration,
  },
  data() {
    return {
      disableContainer: false,
      currentFileConfiguration: {
        type: FileConfiguration,
        default: new FileConfiguration(),
      },
    };
  },
  watch: {
    currentFileConfiguration: {
      immediate: true,
      deep: true,
      handler(newFileConfiguration) {
        // A generic FileConfiguration means the file has not been configured
        let fileIsConfigured =
          newFileConfiguration instanceof FileConfigurationFromUpload;

        // Required or container isn't disabled
        this.$nextTick(() => {
          this.disableContainer = fileIsConfigured;
        });

        this.$emit("input-configuration-update", newFileConfiguration);
        this.$emit("disable-tearsheet-primary-action", !fileIsConfigured);
        this.currentFileConfiguration = newFileConfiguration;
      },
    },
  },
  methods: {
    handleFileUpload(event) {
      this.currentFileConfiguration = new FileConfigurationFromUpload(
        event.detail.addedFiles[0],
      );
    },
    handleFileDeletion() {
      this.currentFileConfiguration = new FileConfiguration();
    },
  },
};
</script>
