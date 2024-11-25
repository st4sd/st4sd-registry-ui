<template>
  <cds-tile :class="theme">
    <div>
      <div>
        <div class="empty-state">
          <img
            class="empty-state-icon"
            src="@/assets/empty-state-bright-box.svg"
          />
          <div>
            <h3>{{ title }}</h3>
            <br />
            <p>{{ message }}</p>
          </div>
        </div>
      </div>
    </div>
  </cds-tile>
</template>
<script>
import "@carbon/web-components/es/components/tile/index.js";

export default {
  name: "NoSearchResultsEmptyState",
  props: {
    title: {
      type: String,
      default: "No data available",
    },
    message: String,
    theme: {
      type: String,
      default: "cds-theme-zone-white",
    },
  },
};
</script>
<style lang="scss" scoped src="@/styles/empty_state_styles.scss"></style>
