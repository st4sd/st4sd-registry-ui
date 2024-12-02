<template>
  <cds-tile :class="theme">
    <div class="empty-state">
      <div class="cds--subgrid cds--subgrid--narrow">
        <div class="cds--css-grid-column cds--col-span-5">
          <img
            class="empty-state-icon"
            src="@/assets/empty-state-bright-magnifying-glass.svg"
          />
          <h3>Hmm, your search didn’t return any results</h3>
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
    theme: {
      type: String,
      default: "cds-theme-zone-white",
    },
  },
};
</script>
<style lang="scss" scoped>
@use "@/styles/empty_state_styles.scss";
</style>
