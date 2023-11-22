<template>
  <div id="toast-notification-container">
    <bx-toast-notification
      id="dsl-valid"
      kind="success"
      timeout="10000"
      @bx-notification-closed="workflowUpdated = false"
      :open="workflowUpdated"
      title="Workflow successfully updated"
    />
  </div>
  <bx-modal open>
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading>Update workflow details</bx-modal-heading>
    </bx-modal-header>
    <bx-modal-body>
      <bx-inline-notification
        id="dsl-invalid-notification"
        kind="error"
        :open="dslValidationErrorProp.length != 0 ? true : false"
        hide-close-button
        title="DSL Validation Errors"
        subtitle="There are errors in the DSL validation, click the show errors button to see them"
      />

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
      <bx-modal-footer-button
        v-if="dslValidationErrorProp.length != 0"
        kind="tertiary"
        @click="$emit('openShowDslErrors')"
        >Show Errors</bx-modal-footer-button
      >
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
  props: {
    node: Object,
    parentNode: Object,
    allNodes: Object,
    dslValidationErrorProp: Array,
  },
  data() {
    return {
      workflowUpdated: false,
    };
  },
  emits: [
    "update",
    "delete",
    "removeParent",
    "stepDeleted",
    "openShowDslErrors",
  ],
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
    update() {
      this.workflowUpdated = true;
    },
  },
};
</script>
<style lang="css" scoped>
@import "@/styles/delete-button-icon-inside-cell-style.css";
@import "@/styles/bx-structured-list-styles.css";
@import "@/styles/bx-accordion-styles.css";
@import "@/styles/bx-modal-styles.css";
@import "@/styles/toast-notification-styles.scss";
</style>
