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
    <dds-hr class="horizontal-line-spacing"></dds-hr>
  </div>
</template>

<script>
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

<style>
.titleContainer a {
  visibility: hidden;
}
.titleContainer:hover a {
  visibility: visible;
}
</style>
