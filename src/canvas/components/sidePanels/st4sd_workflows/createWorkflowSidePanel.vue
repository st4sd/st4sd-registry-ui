<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <cds-side-panel
    open
    size="lg"
    includeOverlay="true"
    title="Create workflow"
    @cds-side-panel-closed="closeSidePanel"
    selector-initial-focus="#createWorkflowSidePanel"
  >
    <workflowForm
      ref="workflowForm"
      @workflowAdded="workflowAdded"
      @validityChanged="updateIsSubmitButtonDisabled"
    />
    <cds-button slot="actions" kind="secondary" @click="closeSidePanel"
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
  emits: ["added", "closeSidePanel"],
  data() {
    return {
      isSubmitButtonDisabled: true,
    };
  },
  methods: {
    closeSidePanel() {
      this.$emit("closeSidePanel");
    },
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
