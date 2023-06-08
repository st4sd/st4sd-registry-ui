<template>
  <bx-modal size="sm" class="no-transform">
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading
        >Login on the <code>stp</code> CLI tool</bx-modal-heading
      >
    </bx-modal-header>
    <bx-modal-body>
      <div data-modal-primary-focus>
        Copy this code and paste it in your terminal to log in to this ST4SD
        instance on the <code>stp</code> CLI.
      </div>
      <div>
        You will be given instructions on how to retrieve a token to complete
        the log in procedure.
      </div>
      <bx-code-snippet>
        stp login --context-name {{ contextName }} {{ url }}
      </bx-code-snippet>
    </bx-modal-body>
    <bx-modal-footer>
      <bx-modal-footer-button class="focus" kind="primary" data-modal-close>
        Close
      </bx-modal-footer-button>
    </bx-modal-footer>
  </bx-modal>
</template>

<script>
import "@carbon/web-components/es/components/tooltip/index.js";
import "@carbon/web-components/es/components/code-snippet/index.js";

export default {
  name: "St4sdLoginModal",
  props: {
    url: String,
    contextName: String,
  },
};
</script>

<style scoped lang="scss">
// The modal was slightly shifted up in small screen (smaller than 840)
// this code will change transofrm from translate3d(0px, -24px, 0px)
// to none when the screen width falls under 840
/// @link https://github.com/carbon-design-system/carbon-for-ibm-dotcom/issues/10480
@media screen and (max-width: 839px) {
  .no-transform::part(dialog) {
    transform: none;
  }
}

bx-modal-body {
  padding-right: 1rem;
  height: 100%;
  width: 100%;
}

bx-code-snippet {
  margin-top: 0.5rem;
}
</style>
