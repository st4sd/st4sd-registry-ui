<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <cds-side-panel
    open
    size="lg"
    includeOverlay="true"
    title="Create component"
    selector-initial-focus="#createComponentSidePanel"
    @cds-side-panel-closed="$emit('side-panel-closed')"
  >
    <componentForm
      ref="componentForm"
      @add="addComponent"
      @invalid="submitDisabled"
    />
    <cds-button slot="actions" kind="secondary" @click="$emit('side-panel-closed')"
      >Cancel</cds-button
    >
    <cds-button
      kind="primary"
      type="submit"
      slot="actions"
      @click="getNewComponentDefinition"
      :disabled="disabled"
    >
      Submit
    </cds-button>
  </cds-side-panel>
</template>

<script>
import "@carbon/web-components/es/components/side-panel/index.js";
import "@carbon/web-components/es/components/button/index.js";
import componentForm from "@/canvas/components/forms/componentForm.vue";

export default {
  components: { componentForm },
  emits: [
    "componentAdded",
    "updateCreateComponentModalNotification",
    "side-panel-closed",
  ],
  props: {
    existingTemplates: Set,
  },
  data() {
    return {
      disabled: true,
    };
  },
  methods: {
    removeEmptyString(obj) {
      Object.keys(obj).forEach((k) => obj[k] === "" && delete obj[k]);
      return obj;
    },
    getNewComponentDefinition() {
      this.$refs.componentForm.add();
    },
    addComponent(definition) {
      if (this.existingTemplates.has(definition.signature.name)) {
        let notification = {
          kind: "error",
          title: `Template ${definition.signature.name} already exists`,
          subtitle: "Template names must be unique.",
          caption: "Please choose another name.",
          code: 0,
        };
        this.$emit("updateCreateComponentModalNotification", notification);
      } else {
        //the new node card's properties here
        let componentNode = {
          id: "1",
          label: definition.signature.name + " (*)",
          type: "component",
          definition: definition,
        };
        this.$emit("componentAdded", componentNode);
      }
    },
    submitDisabled(disabled) {
      this.disabled = disabled;
    },
  },
};
</script>
