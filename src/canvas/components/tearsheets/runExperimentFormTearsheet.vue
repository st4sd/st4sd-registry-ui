<template>
  <cds-tearsheet
    class="cds-theme-zone-g10"
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
        id="runExperimentFilesStep"
        label="Provide Files"
        @click="pageNo = 0"
      ></cds-progress-step>
      <cds-progress-step
        id="runExperimentVariablesStep"
        label="Variables"
        @click="pageNo = 1"
      ></cds-progress-step>
    </cds-progress-indicator>
    <runExperimentForm
      :experiment="experiment"
      :formEmit="runExperimentFormEmit"
      :pageNo="pageNo"
      @post-experiment-run="postExperimentRun()"
    />
    <cds-button
      slot="actions"
      kind="ghost"
      @click="$emit('cds-tearsheet-closed'), (pageNo = 0)"
      >Cancel</cds-button
    >
    <cds-button
      :disabled="pageNo == 0"
      slot="actions"
      kind="secondary"
      @click="pageNo--"
      >Back</cds-button
    >
    <cds-button
      v-if="pageNo < 1"
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
    experiment: Object,
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
      .getElementById("runExperimentFilesStep")
      .setAttribute("state", "current");
  },
  watch: {
    pageNo(page) {
      let inputFilesElement = document.getElementById("runExperimentFilesStep");
      let variablesElement = document.getElementById(
        "runExperimentVariablesStep",
      );
      /*
        AP (20/09/24): This is required because of
        https://github.com/carbon-design-system/carbon-for-ibm-dotcom/issues/11891
        Due to the nature of the issue, states for progress indicators cannot
        be set normally.
      */
      switch (page) {
        case 0:
          inputFilesElement.setAttribute("state", "current");
          variablesElement.setAttribute("state", "incomplete");
          break;
        case 1:
          inputFilesElement.setAttribute("state", "complete");
          variablesElement.setAttribute("state", "current");
          break;
      }
    },
  },
};
</script>
