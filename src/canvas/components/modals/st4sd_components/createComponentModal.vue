<template>
  <bx-modal open>
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading>Create component</bx-modal-heading>
    </bx-modal-header>
    <bx-modal-body>
      <div>
        <componentForm ref="componentForm" @add="addComponent" />
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
        >Submit</bx-modal-footer-button
      >
    </bx-modal-footer>
  </bx-modal>
</template>

<script>
import componentForm from "@/canvas/components/forms/componentForm.vue";

export default {
  components: { componentForm },
  emits: ["componentAdded"],
  methods: {
    removeEmptyString(obj) {
      Object.keys(obj).forEach((k) => obj[k] === "" && delete obj[k]);
      return obj;
    },
    getNewComponentDefinition() {
      this.$refs.componentForm.add();
    },
    addComponent(definition) {
      //the new node card's properties here
      let componentNode = {
        id: "1",
        label: definition.signature.name,
        type: "component",
        definition: definition,
      };
      this.$emit("componentAdded", componentNode);
    },
  },
};
</script>
