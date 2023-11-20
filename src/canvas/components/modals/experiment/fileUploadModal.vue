<template>
  <bx-modal>
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading>{{ title }}</bx-modal-heading>
    </bx-modal-header>
    <bx-modal-body>
      <!-- <bx-file-uploader
        helper-text="Only JSON files. (MAX SIZE???) (MULTIPLE???)"
        label-text="Canvas file"
      >
        <bx-file-drop-container multiple="false">
          Drag and drop file here or click to upload
        </bx-file-drop-container>
      </bx-file-uploader> -->
      <bx-toggle
        id="fileToggle"
        checked="true"
        checked-text="Canvas project files"
        label-text="Choose file type (Canvas project files or DSL)"
        unchecked-text="DSL"
        @bx-toggle-changed="toggleGraphUpload"
      ></bx-toggle>
      <div v-if="graphUpload" class="fileUpload">
        <label for="graphFile">Upload a Canvas project file</label>
        <input
          @change="updateGraphFile"
          type="file"
          accept="application/JSON"
          name="graphFile"
          id="graphFile"
        />
      </div>
      <div v-else>
        <div class="fileUpload">
          <label for="dslFile">Upload a DSL file</label>
          <input
            @change="updateDSLFile"
            type="file"
            accept="application/JSON"
            name="dslFile"
            id="dslFile"
          />
        </div>
        <bx-accordion>
          <bx-accordion-item title-text="PVEP file to add inputs (optional)">
            <label for="inputFile">Upload PVEP file</label>
            <input
              @change="updateInputFile"
              type="file"
              accept="application/JSON"
              name="inputFile"
              id="inputFile"
            />
          </bx-accordion-item>
        </bx-accordion>
      </div>
    </bx-modal-body>
    <bx-modal-footer>
      <bx-modal-footer-button kind="secondary" data-modal-close
        >Cancel</bx-modal-footer-button
      >
      <bx-modal-footer-button
        :disabled="disabled()"
        kind="primary"
        type="submit"
        @click="upload"
        >Upload</bx-modal-footer-button
      >
    </bx-modal-footer>
  </bx-modal>
</template>

<script>
// import "@carbon/web-components/es/components/file-uploader/index.js";
import "@carbon/web-components/es/components/toggle/index.js";

export default {
  props: { title: String },
  emits: ["upload"],
  data() {
    return {
      graphUpload: true,
      graphFile: null,
      dslFile: null,
      inputFile: null,
      submitted: false,
    };
  },
  methods: {
    upload() {
      this.submitted = true;
      if (this.graphUpload && this.graphFile != null) {
        this.$emit("upload", this.graphFile);
      } else if (!this.graphUpload && this.dslFile != null) {
        this.$emit("upload", [this.dslFile, this.inputFile]);
      }
    },
    toggleGraphUpload() {
      this.graphUpload = !this.graphUpload;
    },
    disabled() {
      if (this.graphUpload == true) {
        return this.graphFile == null || this.submitted;
      } else {
        return this.dslFile == null || this.submitted;
      }
    },
    updateGraphFile(event) {
      this.graphFile = event.target.files[0];
    },
    updateDSLFile(event) {
      this.dslFile = event.target.files[0];
    },
    updateInputFile(event) {
      this.inputFile = event.target.files[0];
    },
  },
};
</script>

<style scoped>
input[type="file"] {
  margin-top: 1rem;
}
input[type="file"]::file-selector-button {
  background: #0e61fe;
  padding: 0.7rem 1rem;
  padding-right: 2.5rem;
  margin-right: 1rem;
  color: white;
  border: none;
  cursor: pointer;
}

input[type="file"]::file-selector-button:hover {
  background: #0a52d8;
}

label {
  display: block;
  margin-top: 1rem;
}

br {
  margin: 1rem 0;
}

.fileUpload {
  padding: 0 1rem 1rem;
}
</style>
