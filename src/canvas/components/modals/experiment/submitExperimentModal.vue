<template>
  <cds-modal
    :preventClose="submitting"
    :preventCloseOnClickOutside="submitting"
    @cds-modal-closed="this.$emit('cancel')"
  >
    <cds-modal-header>
      <cds-modal-close-button></cds-modal-close-button>
      <cds-modal-heading>{{ title }}</cds-modal-heading>
    </cds-modal-header>
    <cds-modal-body>
      <cds-text-input
        name="ExperimentName"
        @focus="validateExperimentName"
        @input="validateExperimentName"
        :disabled="submitting"
        :invalid="invalid"
        label="Experiment Name"
        class="cds-theme-zone-g10"
        invalidText="Experiment names should only consist of lower case letters, numbers, and -"
      />
      <div v-if="submitting">
        <cds-inline-loading status="active">
          Submitting Experiment ...
        </cds-inline-loading>
      </div>
    </cds-modal-body>
    <cds-modal-footer>
      <cds-modal-footer-button
        kind="secondary"
        @click="this.$emit('cancel')"
        data-modal-close
        :disabled="submitting"
        >Cancel</cds-modal-footer-button
      >
      <cds-modal-footer-button
        kind="primary"
        @click="submit"
        :disabled="invalid || submitting"
        >Submit</cds-modal-footer-button
      >
    </cds-modal-footer>
  </cds-modal>
</template>

<script>
import "@carbon/web-components/es/components/modal/index.js";
import "@carbon/web-components/es/components/inline-loading/index.js";

import { validateExperimentName } from "@/canvas/functions/validateExperimentName";

export default {
  name: "submitExperimentModal",
  props: {
    title: String,
  },
  data() {
    return {
      experimentName: "",
      invalid: false,
      submitting: false,
    };
  },
  emits: ["submit", "cancel"],
  methods: {
    validateExperimentName(event) {
      this.experimentName = event.target.value;
      this.invalid = validateExperimentName(this.experimentName);
    },
    submit() {
      this.$emit("submit", this.experimentName);
      this.submitting = true;
    },
  },
};
</script>
