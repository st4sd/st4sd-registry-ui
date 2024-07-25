<template>
  <div class="cds--col-sm-4 cds--col-md-2 cds--col-lg-4">
    <c4d-content-item>
      <c4d-content-item-heading>{{ title }}</c4d-content-item-heading>
      <c4d-content-item-copy v-if="subTitle">{{
        subTitle
      }}</c4d-content-item-copy>
    </c4d-content-item>
  </div>
</template>

<script>
import "https://1.www.s81c.com/common/carbon-for-ibm-dotcom/version/v2.8.0/content-item.min.js";
export default {
  name: "ExperimentViewContentBlock",
  props: {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: false,
    },
  },
};
</script>

<style scoped lang="scss">
@use "@carbon/layout";

c4d-content-item-heading {
  padding-top: layout.$spacing-04;
  padding-bottom: layout.$spacing-04;
}

@media screen and (max-width: 671px) {
  c4d-content-item:has(c4d-content-item-copy) {
    margin-bottom: layout.$spacing-07;
  }
}
</style>
