<template>
  <div class="greyBackgroundColor">
    <div>
      <div>
        <div class="empty-state">
          <img
            class="empty-state-icon"
            src="@/assets/empty-state-bright-box.svg"
          />
          <div>
            <h3>No data available</h3>
            <br />
            <p>{{ message }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "NoSearchResultsEmptyState",
  props: {
    message: String,
  },
};
</script>
<style lang="css" scoped src="../../styles/empty_state_styles.css"></style>
