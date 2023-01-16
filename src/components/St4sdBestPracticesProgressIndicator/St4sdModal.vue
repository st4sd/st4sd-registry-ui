<template>
  <bx-modal id="strong-versioning-modal">
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-label>ST4SD Best Practices</bx-modal-label>
      <bx-modal-heading>{{ title }}</bx-modal-heading>
    </bx-modal-header>
    <bx-modal-body>
      <cv-structured-list>
        <template slot="headings">
          <cv-structured-list-heading>
            {{ heading1 }}
          </cv-structured-list-heading>
          <cv-structured-list-heading class="center">
            {{ heading2 }}
          </cv-structured-list-heading>
          <cv-structured-list-heading class="center">
            {{ heading3 }}
          </cv-structured-list-heading>
        </template>
        <template slot="items">
          <cv-structured-list-item
            checked
            v-for="row in structuredListData"
            :key="row.col1"
          >
            <cv-structured-list-data
              v-html="row.col1"
            ></cv-structured-list-data>
            <cv-structured-list-data
              v-if="row.col2Type == 'info'"
              class="center"
            >
              <cv-tooltip :tip="row.col2" direction="left"> </cv-tooltip>
              <!-- <dds-structured-list-cell
                :tooltip="row.col2"
                class="iconPaddingFix"
              /> -->
            </cv-structured-list-data>
            <cv-structured-list-data v-else class="center">
              {{ row.col2 }}
            </cv-structured-list-data>
            <cv-structured-list-data
              class="center"
              v-html="row.col3"
            ></cv-structured-list-data>
          </cv-structured-list-item>

          <!-- cv-tooltip seems to have a bug that autofocuses the last cv-tooltip on the page -->
          <!-- included this 'invisible' cv-tooltip to prevent auto focus on the displayed cv-tooltips -->
          <cv-tooltip tip="" style="top: -10000px"></cv-tooltip>
          <!-- -------------------------------------- -->
        </template>
      </cv-structured-list>
    </bx-modal-body>
    <bx-modal-footer>
      <bx-modal-footer-button class="focus" kind="primary" data-modal-close
        >Close</bx-modal-footer-button
      >
    </bx-modal-footer>
  </bx-modal>
</template>

<script>
import "carbon-web-components/es/components/tooltip/index.js";
export default {
  name: "St4sdModal",
  props: {
    title: String,
    heading1: String,
    heading2: String,
    heading3: String,
    structuredListData: Array,
  },
};
</script>

<style>
.iconPaddingFix {
  border-bottom: none;
  padding-inline-start: 30%;
}
.center {
  text-align: center;
}

.center img {
  transform: translate(0, 25%);
}
</style>
