<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <cds-side-panel
    open
    size="md"
    includeOverlay="true"
    :title="this.step == 0 ? 'Register Experiment' : 'DSL Validation Errors'"
    :currentStep="this.step"
    @cds-side-panel-navigate-back="this.step = 0"
    @cds-side-panel-closed="$emit('side-panel-closed')"
  >
    <div v-if="this.step == 1">
      <DslValidationErrors
        open
        @dslValidationError="this.setDslValidationErrorFunction"
        :dslErrors="dslValidationErrors"
        :allNodes="allNodes"
        :allEdges="allEdges"
      />
    </div>
    <div v-else>
      <cds-inline-loading
        v-show="dslBeingValidated == 'active'"
        :status="dslBeingValidated"
        >Validating DSL...</cds-inline-loading
      >
      <cds-inline-notification
        id="dsl-valid"
        kind="success"
        lowContrast
        :open="dslBeingValidated != 'active' && !dslInvalid"
        hide-close-button
        title="DSL Valid"
      />
      <cds-actionable-notification
        id="dsl-invalid-notification"
        kind="error"
        lowContrast
        inline
        :open="dslBeingValidated != 'active' && dslInvalid"
        hide-close-button
        title="DSL Validation Errors"
        subtitle="There are errors in the DSL validation, click the show errors button to see them"
      >
        <cds-actionable-notification-button @click="this.step = 1" slot="action"
          >View Errors</cds-actionable-notification-button
        >
      </cds-actionable-notification>
      <br />
      <cds-text-input
        class="cds-theme-zone-g10"
        label="Experiment name:"
        placeholder="your-experiment-name"
        @input="validateExperimentName"
        :value="experimentName"
        :invalid="nameInvalid"
        :disabled="dslInvalid"
        invalidText="Experiment names should only consist of lower case letters, numbers, and - to separate words e.g. name-1"
      />
    </div>
    <cds-button
      v-if="this.step == 0"
      slot="actions"
      kind="secondary"
      @click="$emit('side-panel-closed')"
      >Cancel</cds-button
    >
    <cds-button v-else slot="actions" kind="secondary" @click="this.step = 0"
      >Back</cds-button
    >
    <cds-button
      kind="primary"
      type="submit"
      slot="actions"
      @click="registerExperiment()"
      :disabled="dslBeingValidated == 'active' || nameInvalid || dslInvalid"
    >
      Register Experiment
    </cds-button>
  </cds-side-panel>
</template>

<script>
import "@carbon/web-components/es/components/modal/index.js";
import "@carbon/web-components/es/components/inline-loading/index.js";
import "@carbon/web-components/es/components/notification/index.js";

import { getDsl } from "@/canvas/functions/downloadJSON";
import { validateExperimentName } from "@/canvas/functions/validateExperimentName";
import { postDslForValidation } from "@/functions/post_dsl_for_validation";

import DslValidationErrors from "@/canvas/components/DslValidationErrors.vue";

export default {
  components: {
    DslValidationErrors,
  },
  props: {
    name: String,
    allNodes: Object,
    allEdges: Object,
    dslValidationErrors: Array,
    setDslValidationErrorFunction: Function,
  },
  emits: ["dslValidationError", "side-panel-closed"],
  data() {
    return {
      experimentName: null,
      dsl: null,
      nameInvalid: true,
      dslInvalid: null,
      dslInvalidBackend: null,
      dslInvalidTitle: null,
      dslMessage: "",
      dslBeingValidated: "active",
      dslErrors: null,
      edit: null,
      step: 0,
      openSidePanel: true,
    };
  },
  mounted() {
    this.entryNode = this.allNodes.find((node) => node.isEntry == true);
    if (this.validateDsl()) {
      if (this.name.trim().length == 0) {
        this.experimentName = this.dsl.entrypoint["entry-instance"];
        this.edit = false;
      } else {
        this.experimentName = this.name;
        this.edit = true;
      }
      this.nameInvalid = validateExperimentName(this.experimentName);
    }
  },
  methods: {
    postDslForValidation,
    validateDsl() {
      try {
        this.dsl = getDsl(this.allNodes, this.allEdges);
        this.postDslForValidation(true);
        return true;
      } catch (error) {
        this.dslBeingValidated = "finished";
        this.dslInvalid = true;
        this.dslInvalidTitle = error.message;
        return false;
      }
    },
    validateExperimentName(event) {
      this.experimentName = event.target.value;
      this.nameInvalid = validateExperimentName(this.experimentName);
    },
    registerExperiment() {
      if (!this.dslInvalid) {
        this.$router.push({
          name: "register experiment",
          query: {
            edit: this.edit,
          },
          params: {
            name: this.experimentName,
          },
        });
      }
    },
  },
};
</script>
<style lang="css" scoped>
#loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
