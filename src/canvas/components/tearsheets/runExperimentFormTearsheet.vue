<template>
  <cds-tearsheet
    hasCloseIcon
    width="wide"
    influencerPlacement="left"
    @cds-tearsheet-closed="$emit('cds-tearsheet-closed'), (pageNo = 0)"
  >
    <h3 slot="title">Run Experiment</h3>
    <cds-progress-indicator
      id="runExperimentFormProgressIndicator"
      slot="influencer"
      vertical
    >
      <cds-progress-step
        id="runExperimentFormInputsStep"
        label="Inputs"
        @click="pageNo = 0"
      ></cds-progress-step>
      <cds-progress-step
        id="runExperimentFormOptionsStep"
        label="Options"
        @click="pageNo = 1"
      ></cds-progress-step>
      <cds-progress-step
        id="runExperimentFormOutputsStep"
        label="Store Outputs"
        @click="pageNo = 2"
      ></cds-progress-step>
    </cds-progress-indicator>
    <runExperimentForm
      :formEmit="runExperimentFormEmit"
      :pageNo="pageNo"
      @post-experiment-run="postExperimentRun()"
    />
    <cds-button
      v-if="pageNo == 0"
      slot="actions"
      kind="secondary"
      @click="$emit('cds-tearsheet-closed')"
      >Cancel</cds-button
    >
    <cds-button v-else slot="actions" kind="secondary" @click="pageNo--"
      >Previous</cds-button
    >
    <cds-button
      v-if="pageNo < 2"
      slot="actions"
      kind="primary"
      @click="pageNo++"
      >Next</cds-button
    >
    <cds-button
      v-else
      slot="actions"
      kind="primary"
      @click="$emit('st4sd-experiment-run-submitted')"
      >Submit</cds-button
    >
  </cds-tearsheet>
</template>

<script>
import "@carbon/web-components/es/components/tearsheet/index.js";
import "@carbon/web-components/es/components/button/index.js";
import runExperimentForm from "@/canvas/components/forms/runExperimentForm.vue";

export default {
  name: "runExperimentFormTearsheet",
  props: {
    postExperimentRun: Function,
    runExperimentFormEmit: Boolean,
  },
  emits: ["st4sd-experiment-run-submitted", "cds-tearsheet-closed"],
  components: {
    runExperimentForm,
  },
  data() {
    return {
      pageNo: 0,
    };
  },
  mounted() {
    /*
      AP (20/09/24): This is required because of
      https://github.com/carbon-design-system/carbon-for-ibm-dotcom/issues/11891
      Due to the nature of the issue, states for progress indicators cannot
      be set normally.
    */
    document
      .getElementById("runExperimentFormInputsStep")
      .setAttribute("state", "current");
  },
  watch: {
    pageNo(page) {
      let inputsElement = document.getElementById(
        "runExperimentFormInputsStep",
      );
      let optionsElement = document.getElementById(
        "runExperimentFormOptionsStep",
      );
      let storeOutputsElement = document.getElementById(
        "runExperimentFormOutputsStep",
      );
      /*
        AP (20/09/24): This is required because of
        https://github.com/carbon-design-system/carbon-for-ibm-dotcom/issues/11891
        Due to the nature of the issue, states for progress indicators cannot
        be set normally.
      */
      switch (page) {
        case 0:
          inputsElement.setAttribute("state", "current");
          optionsElement.setAttribute("state", "incomplete");
          storeOutputsElement.setAttribute("state", "incomplete");
          break;
        case 1:
          inputsElement.setAttribute("state", "complete");
          optionsElement.setAttribute("state", "current");
          storeOutputsElement.setAttribute("state", "incomplete");
          break;
        case 2:
          inputsElement.setAttribute("state", "complete");
          optionsElement.setAttribute("state", "complete");
          storeOutputsElement.setAttribute("state", "current");
          break;
      }
    },
  },
};
</script>
