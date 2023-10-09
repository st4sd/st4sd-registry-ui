<template>
  <bx-modal class="no-transform">
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading>{{ title }}</bx-modal-heading>
    </bx-modal-header>
    <bx-modal-body>
      <bx-input
        name="ExperimentName"
        @focus="validateExperimentName"
        @input="validateExperimentName"
        :disabled="submitting"
        :invalid="invalid"
        label-text="Experiment Name"
        color-scheme="light"
        validity-message="Experiment names should only consist of lower case letters, numbers, and -"
      >
      </bx-input>
      <div v-if="submitting">
        <bx-inline-loading status="active">
          Submitting Experiment ...
        </bx-inline-loading>
      </div>
    </bx-modal-body>
    <bx-modal-footer>
      <bx-modal-footer-button kind="secondary" data-modal-close
        >Cancel</bx-modal-footer-button
      >
      <bx-modal-footer-button
        kind="primary"
        @click="submit"
        :disabled="invalid || submitting"
        >Submit</bx-modal-footer-button
      >
    </bx-modal-footer>
  </bx-modal>
</template>

<script>
import "@carbon/web-components/es/components/structured-list/index.js";
import "@carbon/web-components/es/components/inline-loading/index.js";
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
  methods: {
    validateExperimentName(event) {
      this.experimentName = event.target.value;
      let pattern =
        /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/g;
      this.invalid = pattern.exec(this.experimentName) === null ? true : false;
    },
    submit() {
      this.$emit("submit", this.experimentName);
      this.submitting = true;
    },
  },
};
</script>
<style lang="css" scoped src="@/styles/bx-modal-styles.css"></style>
