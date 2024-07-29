<template>
  <cds-modal class="no-transform">
    <cds-modal-header>
      <cds-modal-close-button></cds-modal-close-button>
      <cds-modal-label>ST4SD Best Practices</cds-modal-label>
      <cds-modal-heading>{{ title }}</cds-modal-heading>
    </cds-modal-header>
    <cds-modal-body>
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
              <cds-tooltip align="top-right">
                <div class="sb-tooltip-trigger" aria-labelledby="content">
                  <img width="16" height="16" src="@/assets/info.svg" />
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
        </cds-structured-list-body>
      </cds-structured-list>
    </cds-modal-body>
    <cds-modal-footer>
      <cds-modal-footer-button kind="primary" data-modal-close
        >Close</cds-modal-footer-button
      >
    </cds-modal-footer>
  </cds-modal>
</template>

<script>
import "@carbon/web-components/es/components/tooltip/index.js";
import "@carbon/web-components/es/components/structured-list/index.js";
import "@carbon/web-components/es/components/modal/index.js";
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
.center {
  text-align: center;
}

.center img {
  transform: translate(0, -12%);
}
</style>
