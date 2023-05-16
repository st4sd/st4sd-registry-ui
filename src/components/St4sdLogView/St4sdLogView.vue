<!-- 
  Copyright IBM Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0

  Author: Alessandro Pomponio
-->
<template>
  <div class="cds--row logViewFlexContainer">
    <template v-if="loading">
      <div class="cds--col-lg-12">
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
      <div class="cds--col-lg-12">
        <div class="logWidths" v-if="log.length != 0">
          <div class="tableOverflowContainer">
            <bx-code-snippet type="multi" id="logViewCodeSnippet"
              ><p>{{ log }}</p></bx-code-snippet
            >
          </div>
        </div>
        <pre class="logWidths" v-else>
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
import "@carbon/web-components/es/components/skeleton-text/index.js";
import "@carbon/web-components/es/components/code-snippet/index.js";

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
  watch: {
    //Watches the loading variable and when it changes adds a scroll to the code snippet if the snippet is over 5000 chars
    loading: function () {
      if (this.loading == false && this.log.length > 5000) {
        setTimeout(function () {
          //Selects the container for the code snippet and adds a Y-overflow scroll
          let bxSnippetContainer = document.querySelector("#logViewCodeSnippet")
            .shadowRoot.adoptedStyleSheets[0].cssRules[477];
          bxSnippetContainer.style.overflowY = "scroll";
        }, 1);
      }
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

#logViewCodeSnippet {
  max-width: 100%;

  p {
    word-wrap: break-word;
    white-space: pre-wrap;
    word-break: break-word;
  }
}

@media screen and (max-width: 1056px) {
  .logViewFlexContainer {
    flex-direction: column-reverse;
  }

  #logViewCodeSnippet {
    padding-left: 0;
    padding-right: 0;
  }

  #logViewCodeSnippet p {
    padding-left: 0;
    padding-right: 0;
  }
}

.logWidths {
  min-width: 220px;
  white-space: pre-wrap;
  font-size: small;
  background-color: #f4f4f4;
  padding: 20px;
}

.bx--btn--primary {
  margin-top: 0;
}

.download-icon {
  height: 16px;
  width: 16px;
  filter: invert(100);
}
</style>
