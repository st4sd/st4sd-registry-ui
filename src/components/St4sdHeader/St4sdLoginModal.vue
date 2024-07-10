<template>
  <cds-modal size="sm">
    <cds-modal-header>
      <cds-modal-close-button></cds-modal-close-button>
      <cds-modal-heading
        >Login on the <code>stp</code> CLI tool</cds-modal-heading
      >
    </cds-modal-header>
    <cds-modal-body>
      <div data-modal-primary-focus>
        Copy this code and paste it in your terminal to log in to this ST4SD
        instance on the <code>stp</code> CLI.
      </div>
      <div>
        You will be given instructions on how to retrieve a token to complete
        the log in procedure.
      </div>
      <br />
      <div>
        <cds-code-snippet
          @mouseover="alignCopyTooltipBottomRight"
          id="stp-code-snippet"
          class="cds-theme-zone-white"
        >
          stp login --context-name {{ contextName }} {{ url }}
        </cds-code-snippet>
      </div>
    </cds-modal-body>
    <cds-modal-footer>
      <cds-modal-footer-button kind="primary" data-modal-close>
        Close
      </cds-modal-footer-button>
    </cds-modal-footer>
  </cds-modal>
</template>

<script>
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/code-snippet.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/modal.min.js";

export default {
  name: "St4sdLoginModal",
  props: {
    url: String,
    contextName: String,
  },
  methods: {
    alignCopyTooltipBottomRight: () => {
      document
        .getElementById("stp-code-snippet")
        .shadowRoot.querySelector("cds-copy-button")
        .shadowRoot.querySelector("cds-copy")
        .setAttribute("align", "bottom-right");
    },
  },
};
</script>

<style lang="css" scoped>
/* AP: Needed because code snippet otherwise does not respect
the dimensions of the div in which it's contained */
cds-code-snippet {
  box-sizing: border-box;
}
</style>
