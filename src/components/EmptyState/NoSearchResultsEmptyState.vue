<template>
  <cds-tile :class="theme">
    <div>
      <div>
        <div class="empty-state">
          <img
            class="empty-state-icon"
            src="@/assets/empty-state-bright-magnifying-glass.svg"
          />
          <div>
            <h3>Hmm, your search didn’t return any results</h3>
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
    theme: {
      type: String,
      default: "cds-theme-zone-white",
    },
  },
};
</script>
<style lang="scss" scoped src="@/styles/empty_state_styles.scss"></style>
