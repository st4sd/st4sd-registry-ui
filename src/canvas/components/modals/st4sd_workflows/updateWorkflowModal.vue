<template>
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
        @update="updateWorkflowModalNotification"
        @removeParent="removeParent"
        @stepDeleted="stepDeleted"
        @nameChanged="updateIsTemplateButtonDisabled"
        @validityChanged="updateIsSaveButtonDisabled"
      />
      <br />
      <bx-btn kind="danger" @click="emitDelete">
        Delete this workflow &nbsp;
        <img
          class="white-svg"
          height="18"
          width="18"
          src="@/assets/trash-can.svg"
        />
      </bx-btn>
      <bx-btn
        kind="primary"
        :disabled="isTemplateButtonDisabled"
        :title="
          isTemplateButtonDisabled
            ? 'A template with the same name already exists in the Template Workspace'
            : 'Add to Template Workspace'
        "
        @click="emitAddToTemplateWorkspace"
      >
        Add to Template Workspace &nbsp;
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
      <bx-modal-footer-button
        kind="primary"
        type="submit"
        :disabled="isSaveButtonDisabled"
        @click="save"
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
    templatesNamesSet: Set,
  },
  data() {
    return {
      isTemplateButtonDisabled: false,
      isSaveButtonDisabled: false,
    };
  },
  emits: [
    "update",
    "delete",
    "removeParent",
    "stepDeleted",
    "openShowDslErrors",
    "addToTemplateWorkspace",
    "updateWorkflowModalNotification",
  ],
  mounted() {
    if (
      this.templatesNamesSet != undefined &&
      this.node.definition.signature.name != undefined
    ) {
      this.isTemplateButtonDisabled = this.templatesNamesSet.has(
        this.node.definition.signature.name,
      );
    }
  },
  methods: {
    emitDelete() {
      this.$emit("delete");
    },
    emitAddToTemplateWorkspace() {
      //Save the changes
      this.save();
      this.$emit("addToTemplateWorkspace");
      this.isTemplateButtonDisabled = true;
    },
    updateIsTemplateButtonDisabled(newComponentName) {
      this.isTemplateButtonDisabled =
        this.templatesNamesSet.has(newComponentName);
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
    updateWorkflowModalNotification() {
      let notification = {
        kind: "success",
        title: "Workflow successfully updated",
        code: 0,
      };
      this.$emit("updateWorkflowModalNotification", notification);
    },
    updateIsSaveButtonDisabled(isError) {
      this.isSaveButtonDisabled = isError;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/svg.scss";
@import "@/styles/delete-button-icon-inside-cell-style.css";
@import "@/styles/bx-accordion-styles.css";
@import "@/styles/bx-modal-styles.css";
</style>
