<template>
  <cds-modal>
    <cds-modal-header>
      <cds-modal-close-button></cds-modal-close-button>
      <cds-modal-heading>{{ title }}</cds-modal-heading>
    </cds-modal-header>
    <cds-modal-body>
      <cds-tabs @cds-tabs-selected="setActiveTab" value="project">
        <cds-tab value="project">Canvas Project</cds-tab>
        <cds-tab value="dsl">Experiment DSL</cds-tab>
      </cds-tabs>
      <div class="cds--grid">
        <div class="cds--row">
          <cds-file-uploader
            :label-title="
              'Upload a ' +
              (this.selectedTab === 'project' ? 'Canvas project' : 'DSL') +
              ' file'
            "
          >
            <div class="file-uploader-container">
              <cds-file-uploader-button
                accept="application/json"
                :disabled="this.file ? true : false"
                @cds-file-uploader-button-changed="
                  this.file = $event.detail.addedFiles[0]
                "
                >Choose file
              </cds-file-uploader-button>
              <cds-file-uploader-item
                class="cds-theme-zone-white"
                :state="this.file ? 'edit' : 'uploaded'"
                @cds-file-uploader-item-deleted="this.file = null"
                >{{
                  this.file?.name ? this.file.name : "No file chosen"
                }}</cds-file-uploader-item
              >
            </div>
          </cds-file-uploader>
        </div>
        <div class="cds--row" v-if="this.selectedTab !== 'project'">
          <cds-accordion>
            <cds-accordion-item title="PVEP file to add inputs (optional)">
              <cds-file-uploader label-title="Upload PVEP file">
                <div class="file-uploader-container">
                  <cds-file-uploader-button
                    accept="application/json"
                    :disabled="this.pvepFile ? true : false"
                    @cds-file-uploader-button-changed="
                      this.pvepFile = $event.detail.addedFiles[0]
                    "
                    >Choose file
                  </cds-file-uploader-button>
                  <cds-file-uploader-item
                    class="cds-theme-zone-white"
                    :state="this.pvepFile ? 'edit' : 'uploaded'"
                    @cds-file-uploader-item-deleted="this.pvepFile = null"
                    >{{
                      this.pvepFile?.name
                        ? this.pvepFile.name
                        : "No file chosen"
                    }}</cds-file-uploader-item
                  >
                </div>
              </cds-file-uploader>
            </cds-accordion-item>
          </cds-accordion>
        </div>
      </div>
    </cds-modal-body>
    <cds-modal-footer>
      <cds-modal-footer-button kind="secondary" data-modal-close
        >Cancel</cds-modal-footer-button
      >
      <cds-modal-footer-button
        :disabled="this.file == null || this.submitted"
        kind="primary"
        type="submit"
        @click="upload"
        >Upload</cds-modal-footer-button
      >
    </cds-modal-footer>
  </cds-modal>
</template>

<script>
import "@carbon/web-components/es/components/file-uploader/index.js";
import "@carbon/web-components/es/components/tabs/index.js";
import "@carbon/web-components/es/components/modal/index.js";
import "@carbon/web-components/es/components/accordion/index.js";

export default {
  props: { title: String },
  emits: ["upload"],
  data() {
    return {
      selectedTab: "project",
      file: null,
      pvepFile: null,
      submitted: false,
    };
  },
  methods: {
    setActiveTab(event) {
      this.file = null;
      if (this.selectedTab === "dsl") {
        this.pvepFile = null;
      }
      this.selectedTab = event.detail.item.value;
    },
    upload() {
      this.submitted = true;
      if (this.file == null) {
        return;
      }
      if (this.selectedTab === "dsl") {
        this.$emit("upload", [this.file, this.pvepFile]);
      } else {
        this.$emit("upload", this.file);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@/styles/cds-file-uploader-styles.css";

cds-file-uploader {
  padding-top: 1rem;
}
</style>
