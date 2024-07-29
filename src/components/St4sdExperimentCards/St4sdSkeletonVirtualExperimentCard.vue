<template>
  <div class="card-outer-container">
    <div class="card-inner-container">
      <cds-skeleton-text type="heading" />
      <cds-skeleton-text paragraph />
      <div class="tag-group-container">
        <cds-tag v-for="idx in 3" :key="idx" type="gray">
          <!-- 
          AP: margin-bottom: 0 is a hack to get some CSS in the component
          otherwise the skeleton is not centered in the tag
          -->
          <cds-skeleton-text type="line" width="64px; margin-bottom: 0"
        /></cds-tag>
      </div>
    </div>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/skeleton-text/index.js";
import "@carbon/web-components/es/components/tag/index.js";
export default {
  name: "St4sdSkeletonVirtualExperimentCard",
};
</script>

<style scoped lang="scss">
@use "@carbon/layout";
@import "@/styles/cds-tag-styles.scss";
@import "@/styles/st4sd-virtual-experiment-card-styles.scss";

.card-inner-container {
  max-width: 96%;
}
div.card-inner-container > cds-skeleton-text {
  padding-bottom: layout.$spacing-03;
}
</style>
