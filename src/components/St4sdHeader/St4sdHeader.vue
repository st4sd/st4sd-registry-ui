<!-- 
  Copyright IBM Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0

  Author: Alessandro Pomponio
-->
<template>
  <bx-header class="position-reset" aria-label="ST4SD Registry">
    <bx-header-name :href="getDeploymentEndpoint()" prefix="IBM"
      >ST4SD Virtual Experiments Registry</bx-header-name
    >
  </bx-header>
</template>

<script>
import "@carbon/web-components/es/components/ui-shell/index.js";

import { getDeploymentEndpoint } from "@/functions/public_path";
export default {
  name: "ST4SDHeader",
  methods: {
    getDeploymentEndpoint,
  },
};
</script>

<style>
.position-reset {
  position: unset;
}
</style>
