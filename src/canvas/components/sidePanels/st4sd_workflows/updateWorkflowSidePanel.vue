<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <c4p-side-panel
    open
    size="lg"
    includeOverlay="true"
    :title="step == 0 ? 'Update workflow details' : 'DSL Validation Errors'"
    :currentStep="step"
    @c4p-side-panel-navigate-back="step = 0"
    @c4p-side-panel-closed="$emit('side-panel-closed')"
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
      <cds-actionable-notification
        id="dsl-invalid-notification"
        kind="error"
        lowContrast
        inline
        :open="dslValidationErrors.length != 0"
        hide-close-button
        title="DSL Validation Errors"
        subtitle="There are errors in the DSL validation, click the show errors button to see them"
      >
        <cds-actionable-notification-button @click="step = 1" slot="action"
          >View Errors</cds-actionable-notification-button
        >
      </cds-actionable-notification>
      <workflowForm
        ref="workflowForm"
        :node="node"
        :parentNode="parentNode"
        :allNodes="allNodes"
        @update="updateWorkflowSidePanelNotification"
        @removeParent="removeParent"
        @stepDeleted="stepDeleted"
        @nameChanged="updateIsTemplateButtonDisabled"
        @validityChanged="updateIsSaveButtonDisabled"
      />
      <br />
      <div class="cds--subgrid--narrow">
        <cds-button
          class="cds--css-grid-column"
          kind="danger"
          @click="emitDelete"
        >
          Delete this workflow &nbsp;
          <img
            slot="icon"
            class="white-svg"
            height="18"
            width="18"
            src="@/assets/trash-can.svg"
          />
        </cds-button>
        <cds-button
          class="cds--css-grid-column"
          kind="primary"
          :disabled="isTemplateButtonDisabled"
          :title="
            isTemplateButtonDisabled
              ? 'A template with the same name already exists in the Template Workspace'
              : 'Add to Template Workspace'
          "
          @click="emitAddToTemplateWorkspace"
        >
          Add to Template Workspace
        </cds-button>
      </div>
    </div>
    <cds-button
      v-if="step == 0"
      slot="actions"
      kind="secondary"
      @click="$emit('side-panel-closed')"
      >Cancel</cds-button
    >
    <cds-button v-else slot="actions" kind="secondary" @click="step = 0"
      >Back</cds-button
    >
    <cds-button
      kind="primary"
      type="submit"
      slot="actions"
      @click="save"
      :disabled="isSaveButtonDisabled || step != 0"
    >
      Save changes
    </cds-button>
  </c4p-side-panel>
</template>

<script>
import "@carbon/ibm-products-web-components/es/components/side-panel/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/notification/index.js";
import workflowForm from "@/canvas/components/forms/workflowForm.vue";
import DslValidationErrors from "@/canvas/components/DslValidationErrors.vue";
export default {
  components: { workflowForm, DslValidationErrors },
  props: {
    node: Object,
    parentNode: Object,
    allNodes: Object,
    allEdges: Object,
    dslValidationErrorProp: Array,
    templatesNamesSet: Set,
    dslValidationErrors: Array,
    setDslValidationErrorFunction: Function,
  },
  data() {
    return {
      isTemplateButtonDisabled: false,
      isSaveButtonDisabled: false,
      step: 0,
    };
  },
  emits: [
    "update",
    "delete",
    "removeParent",
    "stepDeleted",
    "addToTemplateWorkspace",
    "updateWorkflowSidePanelNotification",
    "side-panel-closed",
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
    updateWorkflowSidePanelNotification() {
      let notification = {
        kind: "success",
        title: "Workflow successfully updated",
        code: 0,
      };
      this.$emit("updateWorkflowSidePanelNotification", notification);
    },
    updateIsSaveButtonDisabled(isError) {
      this.isSaveButtonDisabled = isError;
    },
  },
};
</script>
<style lang="scss" scoped>
@use "@/styles/svg.scss";
</style>
