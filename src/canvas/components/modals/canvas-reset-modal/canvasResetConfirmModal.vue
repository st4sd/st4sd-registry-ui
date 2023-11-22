<template>
  <dds-expressive-modal open>
    <dds-expressive-modal-header>
      <dds-expressive-modal-close-button role="button">
      </dds-expressive-modal-close-button>

      <dds-expressive-modal-heading
        >Reset the canvas?</dds-expressive-modal-heading
      >
    </dds-expressive-modal-header>
    <dds-expressive-modal-body data-modal-primary-focus>
      <p>
        Performing this action will remove all the templates and connections
        from the canvas. This cannot be undone.
      </p>
      <br />
      <p>
        Do you still want to proceed? Click the X at the top right of this modal
        to cancel.
      </p>
    </dds-expressive-modal-body>
    <dds-expressive-modal-footer>
      <dds-button-expressive kind="danger" @click="reset">
        Yes, reset the canvas
      </dds-button-expressive>
    </dds-expressive-modal-footer>
  </dds-expressive-modal>
</template>
<script>
import "@carbon/ibmdotcom-web-components/es/components/expressive-modal/index.js";
export default {
  emits: ["reset"],
  methods: {
    reset() {
      this.$emit("reset");
    },
  },
};
</script>
