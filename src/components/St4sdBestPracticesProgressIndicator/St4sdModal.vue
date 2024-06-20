<template>
  <bx-modal class="no-transform">
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-label>ST4SD Best Practices</bx-modal-label>
      <bx-modal-heading>{{ title }}</bx-modal-heading>
    </bx-modal-header>
    <bx-modal-body>
      <cds-structured-list>
        <cds-structured-list-head>
          <cds-structured-list-header-row>
            <cds-structured-list-header-cell>
              {{ heading1 }}
            </cds-structured-list-header-cell>
            <cds-structured-list-header-cell class="center">
              {{ heading2 }}
            </cds-structured-list-header-cell>
            <cds-structured-list-header-cell class="center">
              {{ heading3 }}
            </cds-structured-list-header-cell>
          </cds-structured-list-header-row>
        </cds-structured-list-head>

        <cds-structured-list-body>
          <cds-structured-list-row
            checked
            v-for="row in structuredListData"
            :key="row.col1"
          >
            <!-- eslint-disable vue/no-v-text-v-html-on-component -->
            <cds-structured-list-cell
              v-html="row.col1"
            ></cds-structured-list-cell>
            <cds-structured-list-cell
              v-if="row.col2Type == 'info'"
              class="center"
            >
              <cds-tooltip align="bottom">
                <div class="sb-tooltip-trigger" aria-labelledby="content">
                  <img width="16" height="16" src="../../assets/info.svg" />
                </div>
                <cds-tooltip-content id="content">
                  {{ row.col2 }}
                </cds-tooltip-content>
              </cds-tooltip>
            </cds-structured-list-cell>
            <cds-structured-list-cell v-else class="center">
              {{ row.col2 }}
            </cds-structured-list-cell>
            <!-- eslint-disable vue/no-v-text-v-html-on-component -->
            <cds-structured-list-cell
              class="center"
              v-html="row.col3"
            ></cds-structured-list-cell>
          </cds-structured-list-row>

          <!-- cv-tooltip seems to have a bug that autofocuses the last cv-tooltip on the page -->
          <!-- included this 'invisible' cv-tooltip to prevent auto focus on the displayed cv-tooltips -->
          <bx-tooltip style="position: absolute; top: -1000px"></bx-tooltip>
          <!-- -------------------------------------- -->
        </cds-structured-list-body>
      </cds-structured-list>
    </bx-modal-body>
    <bx-modal-footer>
      <bx-modal-footer-button class="focus" kind="primary" data-modal-close
        >Close</bx-modal-footer-button
      >
    </bx-modal-footer>
  </bx-modal>
</template>

<script>
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/tooltip.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/structured-list.min.js";
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
.center {
  text-align: center;
}

.center img {
  transform: translate(0, -12%);
}
</style>
