<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <div class="cds--row pad1">
    <ExperimentViewContentBlock title="Description" />
    <div class="cds--col-sm-4 cds--col-md-6 cds--col-lg-12" id="code-snippet">
      <div class="cds--row">
        <cds-code-snippet
          type="multi"
          :disabled="Object.keys(exp_no_interface).length === 0"
        >
          {{ JSON.stringify(exp_no_interface, null, 2) }}
        </cds-code-snippet>
      </div>
      <div class="cds--row">
        <cds-button
          type="button"
          @click="download()"
          :disabled="Object.keys(exp_no_interface).length === 0"
        >
          Download JSON
          <img
            slot="icon"
            class="white-svg"
            height="18"
            width="18"
            src="../../assets/download.svg"
        /></cds-button>
      </div>
    </div>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/code-snippet/index.js";

import ExperimentViewContentBlock from "./ExperimentViewContentBlock.vue";

export default {
  name: "ExperimentJSON",
  props: {
    exp_no_interface: Object,
    experiment: Object,
  },
  components: {
    ExperimentViewContentBlock,
  },
  methods: {
    download() {
      // Create a fictitious anchor to download JSON
      let jsonData = encodeURIComponent(
        JSON.stringify(this.exp_no_interface, null, 2),
      );
      var element = document.createElement("a");
      element.setAttribute("href", "data:text/plain;charset=utf-8," + jsonData);
      element.setAttribute(
        "download",
        "experiment-" + this.experiment.metadata.package.name + ".json",
      );

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/svg.scss";

.download-icon {
  height: 16px;
  width: 16px;
  filter: invert(100);
}

// Padding has to be 2 rems instead of 1 rem like the rest of the items
//  because otherwise the padding will appear "internal" to the code snippet
#code-snippet {
  padding-left: 2rem;
}
</style>
