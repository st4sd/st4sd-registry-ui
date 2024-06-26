<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <cds-side-panel
    open
    size="lg"
    includeOverlay="true"
    title="Create workflow"
    @cds-side-panel-closed="$emit('side-panel-closed')"
    selector-initial-focus="#createWorkflowSidePanel"
  >
    <workflowForm
      ref="workflowForm"
      @workflowAdded="workflowAdded"
      @validityChanged="updateIsSubmitButtonDisabled"
    />
    <cds-button slot="actions" kind="secondary" @click="$emit('side-panel-closed')"
      >Cancel</cds-button
    >
    <cds-button
      kind="primary"
      type="submit"
      slot="actions"
      :disabled="isSubmitButtonDisabled"
      @click="addWorkflow"
    >
      Submit
    </cds-button>
  </cds-side-panel>
</template>

<script>
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/side-panel.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/button.min.js";
import workflowForm from "@/canvas/components/forms/workflowForm.vue";

export default {
  components: { workflowForm },
  emits: ["added", "side-panel-closed"],
  data() {
    return {
      isSubmitButtonDisabled: true,
    };
  },
  methods: {
    addWorkflow() {
      this.$refs.workflowForm.add();
    },
    workflowAdded(workflowNode, inputNode) {
      this.$emit("added", workflowNode, inputNode);
    },
    updateIsSubmitButtonDisabled(isError) {
      this.isSubmitButtonDisabled = isError;
    },
  },
};
</script>
<style lang="css" scoped>
@import "@/styles/bx-modal-styles.css";
</style>
