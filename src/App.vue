<!-- 
  Copyright IBM Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0

  Author: Alessandro Pomponio
-->
<template>
  <div>
    <st4sd-header />
    <div
      class="bx-content"
      id="#main-content"
      style="padding: 2rem; will-change: margin-left"
    >
      <router-view />
    </div>
    <dds-back-to-top></dds-back-to-top>
  </div>
</template>

<script>
import "@carbon/ibmdotcom-web-components/es/components/back-to-top/index.js";
import St4sdHeader from "./components/St4sdHeader";

export default {
  name: "App",
  components: {
    St4sdHeader,
  },
  created() {
    document.title = "ST4SD Registry";
  },
};
</script>

<style lang="scss">
@import "./styles/carbon";

@media screen and (max-width: 671px) {
  .bx--content {
    padding: 2rem 1rem;
  }
}
</style>
