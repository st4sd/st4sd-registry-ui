<template>
  <bx-modal open>
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading>Create workflow</bx-modal-heading>
    </bx-modal-header>
    <bx-modal-body>
      <workflowForm
        ref="workflowForm"
        @workflowAdded="workflowAdded"
        @validityChanged="updateIsSubmitButtonDisabled"
      />
    </bx-modal-body>
    <bx-modal-footer>
      <bx-modal-footer-button kind="secondary" data-modal-close
        >Cancel</bx-modal-footer-button
      >
      <bx-modal-footer-button
        kind="primary"
        type="submit"
        :disabled="isSubmitButtonDisabled"
        @click="addWorkflow"
        >Submit</bx-modal-footer-button
      >
    </bx-modal-footer>
  </bx-modal>
</template>

<script>
import workflowForm from "@/canvas/components/forms/workflowForm.vue";

export default {
  components: { workflowForm },
  emits: ["added"],
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
