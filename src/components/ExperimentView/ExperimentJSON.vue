<template>
  <cv-row class="pad1">
    <cv-column :sm="4" :md="2" :lg="4">
      <dds-content-block class="ve-content-block">
        <dds-content-block-heading class="ve-heading"
          >Description</dds-content-block-heading
        >
      </dds-content-block>
    </cv-column>
    <cv-column :sm="4" :md="6" :lg="12">
      <cv-row>
        <bx-code-snippet language="json" type="multi">
          {{ JSON.stringify(exp_no_interface, null, 2) }}
        </bx-code-snippet>
      </cv-row>
      <cv-row>
        <bx-btn class="bx--btn--primary" type="button" @click="download()">
          Download JSON&nbsp;
          <img class="download-icon" src="../../assets/download.svg"
        /></bx-btn>
      </cv-row>
    </cv-column>
  </cv-row>
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
        JSON.stringify(this.exp_no_interface, null, 2)
      );
      var element = document.createElement("a");
      element.setAttribute("href", "data:text/plain;charset=utf-8," + jsonData);
      element.setAttribute(
        "download",
        "experiment-" + this.experiment.metadata.package.name + ".json"
      );

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
  },
};
</script>

<style>
.download-icon {
  height: 16px;
  width: 16px;
  filter: invert(100);
}
</style>
