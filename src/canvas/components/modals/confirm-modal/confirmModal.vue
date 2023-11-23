<template>
  <dds-expressive-modal open>
    <dds-expressive-modal-header>
      <dds-expressive-modal-close-button role="button">
      </dds-expressive-modal-close-button>

      <dds-expressive-modal-heading>{{ title }}</dds-expressive-modal-heading>
    </dds-expressive-modal-header>
    <dds-expressive-modal-body data-modal-primary-focus>
      <span v-if="paragraph2 != undefined">
        <p>
          {{ paragraph1 }}
        </p>
        <br />
        <p>
          {{ paragraph2 }}
        </p>
      </span>
      <span v-else>
        <p>
          {{ paragraph1 }}
        </p></span
      >
    </dds-expressive-modal-body>
    <dds-expressive-modal-footer>
      <dds-button-expressive
        :kind="buttonKind"
        @click="emitConfirmButtonClicked"
      >
        {{ buttonText }}
      </dds-button-expressive>
    </dds-expressive-modal-footer>
  </dds-expressive-modal>
</template>
<script>
import "@carbon/ibmdotcom-web-components/es/components/expressive-modal/index.js";
export default {
  props: {
    title: String,
    paragraph1: String,
    paragraph2: String,
    buttonText: String,
    buttonKind: {
      type: String,
      default: "danger",
    },
  },
  emits: ["confirm-button-clicked"],
  methods: {
    emitConfirmButtonClicked() {
      this.$emit("confirm-button-clicked");
    },
  },
};
</script>
