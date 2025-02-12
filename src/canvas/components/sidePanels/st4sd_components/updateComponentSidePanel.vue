<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <c4p-side-panel
    open
    size="lg"
    includeOverlay="true"
    :title="
      this.step == 0 ? 'Update component details' : 'DSL Validation Errors'
    "
    :currentStep="this.step"
    @c4p-side-panel-navigate-back="this.step = 0"
    @c4p-side-panel-closed="$emit('side-panel-closed')"
  >
    <div>
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
          <cds-actionable-notification-button
            @click="this.step = 1"
            slot="action"
            >View Errors</cds-actionable-notification-button
          >
        </cds-actionable-notification>
        <br v-if="dslValidationErrors.length != 0" />
        <componentForm
          ref="componentForm"
          :node="node"
          :allNodes="allNodes"
          @update="updateComponentModalNotification"
          @nameChanged="updateIsTemplateButtonDisabled"
          @removeParent="removeParent"
          @invalid="updateComponentInvalidityStatus"
        />
        <br />
        <div class="cds--subgrid--narrow">
          <cds-button
            class="cds--css-grid-column"
            kind="danger"
            @click="emitDelete"
          >
            Delete this component &nbsp;
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
            Add to Template Workspace &nbsp;
          </cds-button>
        </div>
      </div>
    </div>
    <cds-button
      v-if="this.step == 0"
      slot="actions"
      kind="secondary"
      @click="$emit('side-panel-closed')"
      >Cancel</cds-button
    >
    <cds-button v-else slot="actions" kind="secondary" @click="this.step = 0"
      >Back</cds-button
    >
    <cds-button
      kind="primary"
      type="submit"
      slot="actions"
      @click="updateComponentDefinition"
      :disabled="this.componentInvalid || this.step != 0"
    >
      Save
    </cds-button>
  </c4p-side-panel>
</template>

<script>
import "@carbon/ibm-products-web-components/es/components/side-panel/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/notification/index.js";
import DslValidationErrors from "@/canvas/components/DslValidationErrors.vue";
import componentForm from "@/canvas/components/forms/componentForm.vue";

export default {
  components: {
    componentForm,
    DslValidationErrors,
  },
  props: {
    node: Object,
    parentNode: Object,
    allNodes: Object,
    allEdges: Object,
    dslValidationErrors: Array,
    templatesNamesSet: Set,
    setDslValidationErrorFunction: Function,
  },
  emits: [
    "side-panel-closed",
    "updateComponentModalNotification",
    "delete",
    "removeParent",
    "addToTemplateWorkspace",
  ],
  data() {
    return {
      componentInvalid: false,
      isTemplateButtonDisabled: false,
      step: 0,
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
    updateComponentInvalidityStatus(invalid) {
      this.componentInvalid = invalid;
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@/styles/svg.scss";
</style>
