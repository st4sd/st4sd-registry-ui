<template>
  <div class="titleContainer">
    <h2>
      {{ this.title }}
      <a
        :id="`${this.name}`"
        :href="`${getDeploymentEndpoint()}experiment/${id}#${this.name}`"
      >
        <img width="20" heigth="20" src="../../assets/link.svg" />
      </a>
    </h2>
    <c4d-hr class="horizontal-line-spacing"></c4d-hr>
  </div>
</template>

<script>
import "https://1.www.s81c.com/common/carbon-for-ibm-dotcom/version/v2.8.0/horizontal-rule.min.js";
import { getDeploymentEndpoint } from "@/functions/public_path";
export default {
  name: "TitleElement",
  props: {
    title: String,
    name: String,
    id: String,
  },
  methods: {
    getDeploymentEndpoint,
  },
};
</script>

<style scoped lang="scss">
@use "@carbon/layout";

.titleContainer a {
  visibility: hidden;
}
.titleContainer:hover a {
  visibility: visible;
}

h2 {
  padding: layout.$spacing-06 0 0 0;
  text-align: left;
}

.horizontal-line-spacing {
  margin-bottom: layout.$spacing-08;

  @media screen and (max-width: 671px) {
    margin-bottom: layout.$spacing-06;
  }
}
</style>
