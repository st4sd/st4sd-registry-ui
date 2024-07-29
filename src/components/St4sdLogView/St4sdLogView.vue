<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<!-- 
  Copyright IBM Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0

  Author: Alessandro Pomponio
-->
<template>
  <div class="cds--row">
    <template v-if="loading">
      <div class="cds--col-lg-12">
        <cds-tile>
          <pre>
          <cds-skeleton-text
            v-for="i in 3"
            :key="i"
            type="line"
          ></cds-skeleton-text>
        </pre>
        </cds-tile>
      </div>
      <div class="cds--col-lg-4">
        <cds-button-skeleton></cds-button-skeleton>
      </div>
    </template>
    <template v-else>
      <div class="cds--col-lg-12">
        <cds-tile>
          <pre v-if="log.length != 0">{{ log }}</pre>
          <pre v-else>
No logs available
      </pre
          >
        </cds-tile>
      </div>
      <div class="cds--col-lg-4">
        <cds-button
          :disabled="log.length == 0"
          kind="primary"
          @click="download()"
        >
          Download log
          <img
            slot="icon"
            class="white-svg"
            height="18"
            width="18"
            src="../../assets/download.svg"
        /></cds-button>
      </div>
    </template>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/skeleton-text/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/tile/index.js";
export default {
  name: "ST4SDLogView",
  props: {
    log: {
      type: String,
      default: "",
    },
    filename: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    download() {
      let jsonData = encodeURIComponent(this.log);
      var element = document.createElement("a");
      element.setAttribute("href", "data:text/plain;charset=utf-8," + jsonData);
      element.setAttribute("download", this.filename);

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
  },
};
</script>

<style scoped lang="scss">
@use "@carbon/layout";
@import "@/styles/svg.scss";

pre {
  font-family: monospace;
  padding: layout.$spacing-06;
  line-height: var(--cds-body-02-line-height, 1.5);
  white-space: pre-wrap;
  font-size: small;
}

@media screen and (max-width: 1056px) {
  .cds--row {
    flex-direction: column-reverse;
  }

  cds-button, cds-button-skeleton {
    float: right;
    margin-bottom: layout.$spacing-05;
  }
}
</style>
