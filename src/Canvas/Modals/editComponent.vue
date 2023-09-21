<template>
  <bx-modal>
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading>{{ title }}</bx-modal-heading>
    </bx-modal-header>
    <bx-modal-body>
      <slot />
    </bx-modal-body>
    <bx-modal-footer>
      <bx-modal-footer-button kind="secondary" data-modal-close
        >Cancel</bx-modal-footer-button
      >
      <bx-modal-footer-button kind="danger" @click="emitDelete"
        >Delete</bx-modal-footer-button
      >
      <bx-modal-footer-button kind="primary" type="submit" @click="update"
        >Submit</bx-modal-footer-button
      >
    </bx-modal-footer>
  </bx-modal>
</template>

<script>
export default {
  props: { title: String },
  emits: ["update", "delete"],
  methods: {
    update() {
      this.$emit("update");
    },
    emitDelete() {
      this.$emit("delete");
    },
  },
};
</script>
