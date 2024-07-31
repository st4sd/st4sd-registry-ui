<!-- 
  Copyright IBM Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0

  Author: Alessandro Pomponio
-->
<template>
  <div>
    <st4sd-header />
    <div id="main-content" class="bx--grid">
      <router-view />
    </div>
    <c4d-back-to-top></c4d-back-to-top>
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
@use "@carbon/grid";
@include grid.flex-grid();

@import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/themes.css";
@import "@/styles/svg.scss";
</style>

<style scoped>
#main-content {
  margin: 2rem;
}

@media screen and (max-width: 671px) {
  #main-content {
    margin: 1.5rem;
  }
}
</style>
