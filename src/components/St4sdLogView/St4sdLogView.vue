<!-- 
  Copyright IBM Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0

  Author: Alessandro Pomponio
-->
<template>
  <div class="cds--row">
    <template v-if="loading">
      <div class="cds--col">
        <p>
          <bx-skeleton-text
            v-for="i in 3"
            :key="i"
            type="line"
          ></bx-skeleton-text>
        </p>
      </div>
      <div class="cds--col-lg-4">
        <bx-btn-skeleton></bx-btn-skeleton>
      </div>
    </template>
    <template v-else>
      <div class="cds--col">
        <pre v-if="log.length != 0"><code>{{log}}</code></pre>
        <pre v-else>
No logs available
      </pre
        >
      </div>
      <div class="cds--col-lg-4">
        <bx-btn
          v-if="log.length != 0"
          class="bx--btn--primary"
          type="button"
          @click="download()"
        >
          Download log&nbsp;
          <img class="download-icon" src="../../assets/download.svg"
        /></bx-btn>
      </div>
    </template>
  </div>
</template>

<script>
import "carbon-web-components/es/components/skeleton-text/index.js";

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
p {
  font-size: small;
  background-color: #f4f4f4;
  padding: 20px;
}
</style>
