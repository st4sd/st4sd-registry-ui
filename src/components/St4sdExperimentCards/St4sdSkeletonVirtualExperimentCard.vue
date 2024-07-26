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
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/skeleton-text.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/tag.min.js";
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
