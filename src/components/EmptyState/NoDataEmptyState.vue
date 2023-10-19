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
            <h3>{{ title }}</h3>
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
    title: {
      type: String,
      default: "No data available",
    },
    message: String,
  },
};
</script>
<style lang="scss" scoped src="../../styles/empty_state_styles.scss"></style>
