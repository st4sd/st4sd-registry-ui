<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <c4p-side-panel
    open
    size="lg"
    includeOverlay="true"
    title="Create workflow"
    @c4p-side-panel-closed="$emit('side-panel-closed')"
    selector-initial-focus=".createWorkflowSidePanel"
  >
    <workflowForm
      ref="workflowForm"
      @workflowAdded="workflowAdded"
      @validityChanged="updateIsSubmitButtonDisabled"
    />
    <cds-button
      slot="actions"
      kind="secondary"
      @click="$emit('side-panel-closed')"
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
  </c4p-side-panel>
</template>

<script>
import "@carbon/ibm-products-web-components/es/components/side-panel/index.js";
import "@carbon/web-components/es/components/button/index.js";
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
