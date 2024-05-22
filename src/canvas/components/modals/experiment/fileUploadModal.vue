<template>
  <bx-modal>
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading>{{ title }}</bx-modal-heading>
    </bx-modal-header>
    <bx-modal-body>
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
          <bx-accordion class="pvep-accordion">
            <bx-accordion-item
              title-text="PVEP file to add inputs (optional)"
              class="pvep-accordion-item"
            >
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
            </bx-accordion-item>
          </bx-accordion>
        </div>
      </div>
    </bx-modal-body>
    <bx-modal-footer>
      <bx-modal-footer-button kind="secondary" data-modal-close
        >Cancel</bx-modal-footer-button
      >
      <bx-modal-footer-button
        :disabled="this.file == null || this.submitted"
        kind="primary"
        type="submit"
        @click="upload"
        >Upload</bx-modal-footer-button
      >
    </bx-modal-footer>
  </bx-modal>
</template>

<script>
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/file-uploader.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/tabs.min.js";

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

<style scoped>
.file-uploader-container {
  display: flex;
  flex-direction: row;
}

cds-file-uploader {
  padding-top: 1rem;
}
</style>
