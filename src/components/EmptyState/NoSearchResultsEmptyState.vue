<template>
  <div class="greyBackgroundColor">
    <div>
      <div>
        <div class="empty-state">
          <img
            class="empty-search-results-icon"
            src="@/assets/empty-state-bright-magnifying-glass.svg"
          />
          <div>
            <h3>Hmm, your search didn’t return any results</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "NoSearchResultsEmptyState",
};
</script>
<style scoped>
div.empty-state {
  padding: 5rem;
  min-height: 15rem;
}

div.greyBackgroundColor {
  background-color: var(--cds-ui-01, #f4f4f4);
}

.empty-search-results-icon {
  max-height: 100px;
  max-width: 100px;
  width: 100%;
  height: 100%;
  margin: auto 0rem auto 0.2rem;
}
</style>
