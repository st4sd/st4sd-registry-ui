<template>
  <div class="cds--col-sm-4 cds--col-md-2 cds--col-lg-4">
    <div class="ve-content-block">
      <p class="ve-heading">{{ title }}</p>
      <br />
      <p v-if="subTitle" class="ve-sub-heading">{{ subTitle }}</p>
    </div>
  </div>
</template>

<script>
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

<style scoped>
.ve-content-block {
  padding: 0;
  padding-bottom: 0.5rem;
}

.ve-sub-heading {
  @media screen and (max-width: 1056px) and (min-width: 672px) {
    font-size: calc(16px + (24 - 16) * ((100vw - 42rem) / (1056 - 672)));
    margin-bottom: 1rem;
  }
  @media screen and (max-width: 671px) {
    margin-left: 0;
  }
  font-weight: 400;
  line-height: 16px;
  font-size: 16px;
  margin-right: 16px;
}

.ve-heading {
  @media screen and (max-width: 1056px) and (min-width: 672px) {
    font-size: calc(24px + (24 - 16) * ((100vw - 42rem) / (1056 - 672)));
    margin-bottom: 1rem;
  }
  @media screen and (max-width: 671px) {
    margin-bottom: 16px;
    margin-left: 0;
  }
  font-weight: 300;
  font-size: 24px;
}
</style>
