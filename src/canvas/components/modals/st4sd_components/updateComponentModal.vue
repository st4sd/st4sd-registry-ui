<template>
  <bx-modal open>
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading data-modal-primary-focus
        >Update component details</bx-modal-heading
      >
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

      <componentForm
        ref="componentForm"
        :node="node"
        :allNodes="allNodes"
        :parentNode="parentNode"
        @update="updateComponentModalNotification"
        @nameChanged="updateIsTemplateButtonDisabled"
        @removeParent="removeParent"
        @invalid="submitDisabled"
      />
      <br />
      <bx-btn kind="danger" @click="emitDelete">
        Delete this component &nbsp;
        <img class="trash-can-icon" src="@/assets/trash-can.svg" />
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
      <bx-modal-footer-button kind="secondary" data-modal-close>
        Cancel
      </bx-modal-footer-button>
      <bx-modal-footer-button
        kind="primary"
        type="submit"
        @click="updateComponentDefinition"
        :disabled="disabled"
      >
        Save
      </bx-modal-footer-button>
    </bx-modal-footer>
  </bx-modal>
</template>

<script>
import componentForm from "@/canvas/components/forms/componentForm.vue";

export default {
  components: {
    componentForm,
  },
  props: {
    node: Object,
    parentNode: Object,
    allNodes: Object,
    dslValidationErrorProp: Array,
    templatesNamesSet: Set,
  },
  emits: [
    "updateComponentModalNotification",
    "delete",
    "removeParent",
    "openShowDslErrors",
    "addToTemplateWorkspace",
  ],
  data() {
    return {
      disabled: false,
      isTemplateButtonDisabled: false,
    };
  },
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
      this.updateComponentDefinition();
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
    updateComponentDefinition() {
      this.$refs.componentForm.update();
    },
    updateComponentModalNotification() {
      let notification = {
        kind: "success",
        title: "Component successfully updated",
        code: 0,
      };
      this.$emit("updateComponentModalNotification", notification);
    },
    submitDisabled(disabled) {
      this.disabled = disabled;
    },
  },
};
</script>
<style lang="css" scoped>
@import "@/styles/bx-structured-list-styles.css";
@import "@/styles/bx-accordion-styles.css";
@import "@/styles/bx-modal-styles.css";
@import "@/styles/toast-notification-styles.scss";

.trash-can-icon {
  max-height: 18px;
  max-width: 18px;
  width: 100%;
  height: 100%;
  margin: 0rem;
  -webkit-filter: invert(0.99);
  filter: invert(0.99);
}
</style>
