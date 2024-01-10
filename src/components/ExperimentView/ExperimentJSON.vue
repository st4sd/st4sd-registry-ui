<template>
  <div class="cds--row pad1">
    <div class="cds--col-sm-4 cds--col-md-2 cds--col-lg-4">
      <dds-content-block class="ve-content-block">
        <dds-content-block-heading class="ve-heading"
          >Description</dds-content-block-heading
        >
      </dds-content-block>
    </div>
    <div class="cds--col-sm-4 cds--col-md-6 cds--col-lg-12" id="code-snippet">
      <div class="cds--row">
        <bx-code-snippet language="json" type="multi">
          {{ JSON.stringify(exp_no_interface, null, 2) }}
        </bx-code-snippet>
      </div>
      <div class="cds--row">
        <bx-btn
          class="bx--btn--primary"
          type="button"
          @click="download()"
          :disabled="Object.keys(exp_no_interface).length === 0"
        >
          Download JSON&nbsp;
          <img
            class="white-svg"
            height="18"
            width="18"
            src="../../assets/download.svg"
        /></bx-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExperimentJSON",
  props: {
    exp_no_interface: Object,
    experiment: Object,
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

#code-snippet {
  padding-left: 1rem;
}
</style>
