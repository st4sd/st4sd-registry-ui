<template>
  <bx-modal class="no-transform">
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-label>ST4SD Best Practices</bx-modal-label>
      <bx-modal-heading>{{ title }}</bx-modal-heading>
    </bx-modal-header>
    <bx-modal-body>
      <bx-structured-list>
        <bx-structured-list-head>
          <bx-structured-list-header-row>
            <bx-structured-list-header-cell>
              {{ heading1 }}
            </bx-structured-list-header-cell>
            <bx-structured-list-header-cell class="center">
              {{ heading2 }}
            </bx-structured-list-header-cell>
            <bx-structured-list-header-cell class="center">
              {{ heading3 }}
            </bx-structured-list-header-cell>
          </bx-structured-list-header-row>
        </bx-structured-list-head>

        <bx-structured-list-body>
          <bx-structured-list-row
            checked
            v-for="row in structuredListData"
            :key="row.col1"
          >
            <!-- eslint-disable vue/no-v-text-v-html-on-component -->
            <bx-structured-list-cell
              v-html="row.col1"
            ></bx-structured-list-cell>
            <bx-structured-list-cell
              v-if="row.col2Type == 'info'"
              class="center"
            >
              <button
                class="bx-tooltip bx--tooltip__trigger bx--tooltip--a11y bx--tooltip--left bx--tooltip--align-center"
              >
                <img width="16" height="16" src="../../assets/info.svg" />
                <span class="bx--assistive-text">{{ row.col2 }}</span>
              </button>
            </bx-structured-list-cell>
            <bx-structured-list-cell v-else class="center">
              {{ row.col2 }}
            </bx-structured-list-cell>
            <!-- eslint-disable vue/no-v-text-v-html-on-component -->
            <bx-structured-list-cell
              class="center"
              v-html="row.col3"
            ></bx-structured-list-cell>
          </bx-structured-list-row>

          <!-- cv-tooltip seems to have a bug that autofocuses the last cv-tooltip on the page -->
          <!-- included this 'invisible' cv-tooltip to prevent auto focus on the displayed cv-tooltips -->
          <bx-tooltip style="position: absolute; top: -1000px"></bx-tooltip>
          <!-- -------------------------------------- -->
        </bx-structured-list-body>
      </bx-structured-list>
    </bx-modal-body>
    <bx-modal-footer>
      <bx-modal-footer-button class="focus" kind="primary" data-modal-close
        >Close</bx-modal-footer-button
      >
    </bx-modal-footer>
  </bx-modal>
</template>

<script>
import "@carbon/web-components/es/components/tooltip/index.js";
import "@carbon/web-components/es/components/structured-list/index.js";
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

<style lang="css" scoped>
@import "@/styles/bx-modal-styles.css";

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
