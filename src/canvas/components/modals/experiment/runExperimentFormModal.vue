<template>
  <bx-modal class="no-transform">
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading>{{ title }}</bx-modal-heading>
    </bx-modal-header>
    <bx-modal-body>
      <slot />
    </bx-modal-body>
    <bx-modal-footer>
      <bx-modal-footer-button
        :disabled="parameterisationLoading"
        kind="secondary"
        data-modal-close
        >Cancel</bx-modal-footer-button
      >
      <bx-modal-footer-button
        :disabled="parameterisationLoading"
        kind="primary"
        @click="submit"
        >Submit</bx-modal-footer-button
      >
    </bx-modal-footer>
  </bx-modal>
</template>

<script>
import "https://1.www.s81c.com/common/carbon/web-components/version/v1.42.0/modal.min.js";
export default {
  props: ["title", "parameterisationLoading"],
  setup(props, { emit }) {
    const submit = () => {
      emit("submit");
    };
    return { submit };
  },
};
</script>
