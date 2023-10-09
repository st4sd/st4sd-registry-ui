<template>
  <bx-modal open>
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading>Update workflow details</bx-modal-heading>
    </bx-modal-header>
    <bx-modal-body>
      <workflowForm
        ref="workflowForm"
        :node="node"
        :parentNode="parentNode"
        :allNodes="allNodes"
        @update="update"
        @removeParent="removeParent"
        @stepDeleted="stepDeleted"
      />
      <br />
      <bx-btn kind="danger" @click="emitDelete">
        Delete this workflow &nbsp;
        <img class="trash-can-icon" src="@/assets/trash-can.svg" />
      </bx-btn>
    </bx-modal-body>
    <bx-modal-footer>
      <bx-modal-footer-button kind="secondary" data-modal-close
        >Cancel</bx-modal-footer-button
      >
      <bx-modal-footer-button kind="primary" type="submit" @click="save"
        >Save changes</bx-modal-footer-button
      >
    </bx-modal-footer>
  </bx-modal>
</template>

<script>
import workflowForm from "@/canvas/components/forms/workflowForm.vue";
export default {
  components: { workflowForm },
  props: { node: Object, parentNode: Object, allNodes: Object },
  emits: ["update", "delete", "removeParent", "stepDeleted"],
  data() {
    return {};
  },
  methods: {
    emitDelete() {
      this.$emit("delete");
    },
    removeParent() {
      this.$emit("removeParent");
    },
    stepDeleted(tobeUpdatedNode) {
      this.$emit("stepDeleted", tobeUpdatedNode);
    },
    save() {
      this.$refs.workflowForm.update();
    },
    update(updatedWorkflow) {
      this.$emit("update", updatedWorkflow);
    },
  },
};
</script>
<style lang="css" scoped>
@import "@/styles/delete-button-icon-inside-cell-style.css";
@import "@/styles/bx-structured-list-styles.css";
@import "@/styles/bx-accordion-styles.css";
@import "@/styles/bx-modal-styles.css";
</style>
