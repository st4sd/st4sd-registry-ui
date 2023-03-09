<!-- 
  Copyright IBM Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0

  Author: Alessandro Pomponio
-->
<template>
  <cv-row class="logViewFlexContainer">
    <template v-if="loading">
      <cv-column :lg="12">
        <p>
          <bx-skeleton-text
            v-for="i in 3"
            :key="i"
            type="line"
          ></bx-skeleton-text>
        </p>
      </cv-column>
      <cv-column :lg="4">
        <bx-btn-skeleton></bx-btn-skeleton>
      </cv-column>
    </template>
    <template v-else>
      <cv-column :lg="12">
        <pre
          class="logWidths"
          v-if="log.length != 0"
        ><div class="tableOverflowContainer"><cv-code-snippet kind="multiline" id="logViewCodeSnippet">{{log}}</cv-code-snippet></div></pre>
        <pre class="logWidths" v-else>
No logs available
      </pre
        >
      </cv-column>
      <cv-column :lg="4">
        <bx-btn
          v-if="log.length != 0"
          class="bx--btn--primary"
          type="button"
          @click="download()"
        >
          Download log&nbsp;
          <img class="download-icon" src="../../assets/download.svg"
        /></bx-btn>
      </cv-column>
    </template>
  </cv-row>
</template>

<script>
import "@carbon/web-components/es/components/skeleton-text/index.js";

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

.tableOverflowContainer {
  overflow-x: scroll;
}

.logWidths {
  min-width: 220px;
}

@media screen and (max-width: 1056px) {
  .logViewFlexContainer {
    flex-direction: column-reverse;
  }
}

.bx--btn--primary {
  margin-top: 0;
}

#logViewCodeSnippet {
  max-width: unset;
}

.download-icon {
  height: 16px;
  width: 16px;
  filter: invert(100);
}
</style>
