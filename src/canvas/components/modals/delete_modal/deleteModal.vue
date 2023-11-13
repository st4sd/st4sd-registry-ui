<template>
  <bx-modal open size="sm">
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-label data-modal-primary-focus
        >Delete {{ nodeType }}</bx-modal-label
      >
      <bx-modal-heading
        >Are you sure you want to delete this {{ nodeType }}?</bx-modal-heading
      >
    </bx-modal-header>
    <bx-modal-footer>
      <bx-modal-footer-button kind="secondary" data-modal-close
        >Cancel</bx-modal-footer-button
      >
      <bx-modal-footer-button kind="danger" @click="emitDelete"
        >Delete</bx-modal-footer-button
      >
    </bx-modal-footer>
  </bx-modal>
</template>
<script>
import "@carbon/web-components/es/components/modal/index.js";
import "@carbon/web-components/es/components/button/index.js";

export default {
  props: {
    nodeType: String,
  },
  emits: ["delete"],
  methods: {
    emitDelete() {
      this.$emit("delete");
    },
  },
};
</script>
