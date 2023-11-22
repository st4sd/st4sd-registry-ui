<template>
  <bx-modal open>
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading data-modal-primary-focus
        >Update component details</bx-modal-heading
      >
    </bx-modal-header>
    <bx-modal-body>
      <componentForm
        ref="componentForm"
        :node="node"
        :allNodes="allNodes"
        :parentNode="parentNode"
        @update="update"
        @removeParent="removeParent"
        @invalid="submitDisabled"
      />
      <br />
      <bx-btn kind="danger" @click="emitDelete">
        Delete this component &nbsp;
        <img class="trash-can-icon" src="@/assets/trash-can.svg" />
      </bx-btn>
    </bx-modal-body>
    <bx-modal-footer>
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
  props: { node: Object, parentNode: Object, allNodes: Object },
  emits: ["updated", "delete", "removeParent"],
  data() {
    return {
      disabled: false,
    };
  },
  methods: {
    emitDelete() {
      this.$emit("delete");
    },
    removeParent() {
      this.$emit("removeParent");
    },
    updateComponentDefinition() {
      this.$refs.componentForm.update();
    },
    update() {
      this.$emit("updated");
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
