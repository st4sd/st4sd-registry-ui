<template>
  <bx-modal open>
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading>Create component</bx-modal-heading>
    </bx-modal-header>
    <bx-modal-body>
      <div>
        <componentForm
          ref="componentForm"
          @add="addComponent"
          @invalid="submitDisabled"
        />
      </div>
    </bx-modal-body>
    <bx-modal-footer>
      <bx-modal-footer-button kind="secondary" data-modal-close
        >Cancel</bx-modal-footer-button
      >
      <bx-modal-footer-button
        kind="primary"
        type="submit"
        @click="getNewComponentDefinition"
        :disabled="disabled"
        >Submit</bx-modal-footer-button
      >
    </bx-modal-footer>
  </bx-modal>
</template>

<script>
import componentForm from "@/canvas/components/forms/componentForm.vue";

export default {
  components: { componentForm },
  emits: ["componentAdded", "updateCreateComponentModalNotification"],
  props: {
    existingTemplates: Set,
  },
  data() {
    return {
      disabled: false,
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
