<template>
  <p><strong>Upload files from your local machine</strong></p>
  <p>Only one file can be uploaded.</p>
  <cds-file-uploader>
    <cds-file-uploader-drop-container
      :disabled="this.file ? true : false"
      @cds-file-uploader-drop-container-changed="
        this.file = $event.detail.addedFiles[0]
      "
    >
      Drag and drop files here or click to upload
    </cds-file-uploader-drop-container>
    <cds-file-uploader-item
      v-if="this.file"
      :state="this.file ? 'edit' : 'uploaded'"
      @cds-file-uploader-item-deleted="this.file = null"
      >{{ this.file.name }}</cds-file-uploader-item
    >
  </cds-file-uploader>
</template>

<script>
import "@carbon/web-components/es/components/file-uploader/index.js";

export default {
  name: "InputConfigurationFileUploadForm",
  emits: ["input-configuration-complete"],
  watch: {
    file(file) {
      // Update when merged
      console.log(file);
    },
  },
  data() {
    return {
      file: null,
    };
  },
};
</script>
