<template>
  <div class="greyBackgroundColor">
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
  </div>
</template>
<script>
export default {
  name: "NoSearchResultsEmptyState",
};
</script>
<style lang="css" scoped src="../../styles/empty_state_styles.css"></style>
