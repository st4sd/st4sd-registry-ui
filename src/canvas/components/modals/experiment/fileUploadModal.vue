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
      <label for="dslFile">Upload a DSL file</label>
      <input
        @change="updateDSLFile"
        type="file"
        accept="application/JSON"
        name="dslFile"
        id="dslFile"
      />
      <hr />
      <label for="inputFile">Upload an input file</label>
      <input
        @change="updateInputFile"
        type="file"
        accept="application/JSON"
        name="inputFile"
        id="inputFile"
      />
    </bx-modal-body>
    <bx-modal-footer>
      <bx-modal-footer-button kind="secondary" data-modal-close
        >Cancel</bx-modal-footer-button
      >
      <bx-modal-footer-button
        :disabled="dslFile == null || inputFile == null || submitted"
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

export default {
  props: { title: String },
  emits: ["upload"],
  data() {
    return {
      dslFile: null,
      inputFile: null,
      submitted: false,
    };
  },
  methods: {
    upload() {
      this.submitted = true;
      this.$emit("upload", [this.dslFile, this.inputFile]);
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

hr {
  margin: 1rem 0;
}
</style>
