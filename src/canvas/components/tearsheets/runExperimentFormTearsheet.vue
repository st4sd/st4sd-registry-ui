<template>
  <cds-tearsheet
    data-index="one"
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
      <cds-progress-step
        id="runExperimentPlatformsStep"
        label="Platforms"
        @click="pageNo = 2"
      ></cds-progress-step>
    </cds-progress-indicator>
    <div v-if="pageNo == 0" class="tab-panels">
      <RunExperimentFiles />
      <FilesTable
        @file-being-configured="$emit('file-being-configured', $event)"
        @required-configuration-complete="
          requiredStepConfigurationComplete[0] = $event
        "
        :experiment="experiment"
      />
    </div>
    <div v-if="pageNo == 1" class="tab-panels">
      <RunExperimentVariables
        @required-configuration-complete="
          requiredStepConfigurationComplete[1] = $event
        "
        :experiment="experiment"
      />
    </div>
    <div v-if="pageNo == 2" class="tab-panels">
      <RunExperimentPlatforms
        @required-configuration-complete="
          requiredStepConfigurationComplete[2] = $event
        "
        :experiment="experiment"
      />
    </div>
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
      :disabled="
        !requiredStepConfigurationComplete.every((isComplete) => isComplete)
      "
      @click="$emit('st4sd-experiment-run-submitted')"
      >Submit</cds-button
    >
  </cds-tearsheet>
</template>

<script>
import "@carbon/web-components/es/components/tearsheet/index.js";
import "@carbon/web-components/es/components/button/index.js";

import FilesTable from "@/components/ExperimentView/ExperimentFiles/FilesTable.vue";
import RunExperimentFiles from "@/components/ExperimentView/ExperimentFiles/RunExperimentFiles.vue";
import RunExperimentVariables from "@/components/ExperimentView/RunExperimentVariables.vue";
import RunExperimentPlatforms from "@/components/ExperimentView/RunExperimentPlatforms.vue";

export default {
  name: "runExperimentFormTearsheet",
  props: {
    experiment: Object,
    runExperimentFormEmit: Boolean,
  },
  emits: [
    "st4sd-experiment-run-submitted",
    "cds-tearsheet-closed",
    "file-being-configured",
  ],
  components: {
    FilesTable,
    RunExperimentFiles,
    RunExperimentVariables,
    RunExperimentPlatforms,
  },
  data() {
    return {
      requiredStepConfigurationComplete: [false, false, false],
      pageNo: 0,
      tabs: [
        { name: "runExperimentFilesStep", index: 0 },
        { name: "runExperimentVariablesStep", index: 1 },
        { name: "runExperimentPlatformsStep", index: 2 },
      ],
    };
  },
  mounted() {
    /*
      AP (20/09/24): This is required because of
      https://github.com/carbon-design-system/carbon-for-ibm-dotcom/issues/11891
      Due to the nature of the issue, states for progress indicators cannot
      be set normally.
    */
    document.getElementById(this.tabs[0].name).setAttribute("state", "current");
  },
  methods: {
    setProgressIndicatorStatus(pageNo, index) {
      if (index == pageNo) {
        return "current";
      } else if (index > pageNo) {
        return "incomplete";
      }
      return this.requiredStepConfigurationComplete[index]
        ? "complete"
        : "invalid";
    },
  },
  watch: {
    pageNo(page) {
      /*
        AP (20/09/24): This is required because of
        https://github.com/carbon-design-system/carbon-for-ibm-dotcom/issues/11891
        Due to the nature of the issue, states for progress indicators cannot
        be set normally.
      */

      for (let i = 0; i < this.tabs.length; i++) {
        document
          .getElementById(this.tabs[i].name)
          .setAttribute(
            "state",
            this.setProgressIndicatorStatus(page, this.tabs[i].index),
          );
      }
    },
  },
};
</script>
