<!-- 
  Copyright IBM Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0

  Author: Alessandro Pomponio
-->
<template>
  <div>
    <st4sd-header />
    <cv-content id="#main-content">
      <router-view />
    </cv-content>
    <dds-back-to-top></dds-back-to-top>
  </div>
</template>

<script>
import St4sdHeader from "./components/St4sdHeader";
import "@carbon/ibmdotcom-web-components/es/components/back-to-top/index.js";
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
</style>
