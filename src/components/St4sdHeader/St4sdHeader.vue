<!-- 
  Copyright IBM Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0

  Author: Alessandro Pomponio
-->
<template>
  <bx-header class="position-reset" aria-label="ST4SD Registry">
    <bx-header-name :href="getDeploymentEndpoint()" prefix="IBM"
      >ST4SD Registry</bx-header-name
    >
    <bx-header-nav-item
      :href="`${getDeploymentEndpoint()}build-canvas`"
      v-if="isBuildCanvasEnabled"
      class="hidden-on-mobile"
      >Build an experiment</bx-header-nav-item
    >
    <bx-link
      @click="openModal('login')"
      v-if="!isGlobalRegistry"
      class="hidden-on-mobile"
    >
      Login on stp
      <img
        class="white-svg"
        height="18"
        width="18"
        src="@/assets/terminal.svg"
      />
    </bx-link>
  </bx-header>
  <St4sdLoginModal id="login" :url="this.url" :contextName="this.contextName" />
</template>

<script>
import "@carbon/web-components/es/components/ui-shell/index.js";
import "@carbon/web-components/es/components/list/index.js";
import { getDeploymentEndpoint } from "@/functions/public_path";
import St4sdLoginModal from "@/components/St4sdHeader/St4sdLoginModal.vue";
import { registryUISharedState } from "@/stores/registryUISharedState";

export default {
  name: "ST4SDHeader",
  data() {
    return {
      url: "",
      contextName: "",
      isGlobalRegistry: false,
      isBuildCanvasEnabled: false,
    };
  },
  components: {
    St4sdLoginModal,
  },
  methods: {
    getDeploymentEndpoint,
    openModal(id) {
      document.getElementById(id).open = true;
    },
  },
  mounted() {
    this.url = window.location.origin;
    this.contextName = window.location.host.split(".")[0];
    this.isGlobalRegistry = registryUISharedState.isGlobalRegistry;
    this.isBuildCanvasEnabled = registryUISharedState.isBuildCanvasEnabled;
  },
};
</script>

<style scoped lang="scss">
@import "@/styles/svg.scss";
@import "@/styles/hidden-on-mobile.css";

.position-reset {
  position: unset;
}

bx-link {
  margin: 0 0 0 auto;
  padding: 0px 1rem 0px 2rem;
}

bx-link::part(link) {
  color: rgb(244, 244, 244);
  cursor: pointer;
  width: 120%;
  align-items: center;
}
</style>
