<template>
  <c4d-expressive-modal open>
    <c4d-expressive-modal-header>
      <c4d-expressive-modal-close-button role="button">
      </c4d-expressive-modal-close-button>

      <c4d-expressive-modal-heading>{{ title }}</c4d-expressive-modal-heading>
    </c4d-expressive-modal-header>
    <c4d-expressive-modal-body data-modal-primary-focus>
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
    </c4d-expressive-modal-body>
    <c4d-expressive-modal-footer>
      <cds-button :kind="buttonKind" @click="emitConfirmButtonClicked">
        {{ buttonText }}
      </cds-button>
    </c4d-expressive-modal-footer>
  </c4d-expressive-modal>
</template>
<script>
import "@carbon/ibmdotcom-web-components/es/components/expressive-modal/index.js";
import "@carbon/web-components/es/components/button/index.js";
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
