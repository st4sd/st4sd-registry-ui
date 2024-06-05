<template>
  <bx-modal open>
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading>DSL Validations Errors</bx-modal-heading>
    </bx-modal-header>
    <bx-modal-body>
      <bx-inline-loading
        v-if="dslBeingValidated == 'active'"
        :status="dslBeingValidated"
        >Validating DSL...</bx-inline-loading
      >
      <bx-btn v-else @click="validateDsl">Re-run Validation</bx-btn>
      <bx-inline-notification
        id="dsl-valid"
        kind="success"
        :open="dslBeingValidated != 'active' && dslErrors.length == 0"
        hide-close-button
        title="DSL Valid"
      />
      <bx-accordion data-modal-primary-focus>
        <bx-accordion-item
          v-for="(problem, idx) in dslErrors"
          :key="idx"
          :title-text="`Problem ${idx + 1}`"
          :open="idx == 0 ? true : false"
        >
          <pre>{{ JSON.stringify(problem, undefined, 2) }}</pre>
        </bx-accordion-item>
      </bx-accordion>
    </bx-modal-body>
  </bx-modal>
</template>

<script>
import "@carbon/web-components/es/components/inline-loading/index.js";

import { getDsl } from "@/canvas/functions/downloadJSON";
import { postDslForValidation } from "@/functions/post_dsl_for_validation";

export default {
  data() {
    return {
      dsl: null,
      dslInvalid: null,
      dslInvalidTitle: null,
      dslMessage: "",
      dslBeingValidated: "finished",
      dslErrors: null,
    };
  },
  props: {
    dslErrorsProp: Array,
    allNodes: Object,
    allEdges: Object,
  },
  emits: ["dslValidationError"],
  watch: {
    dslErrorsProp: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler() {
        this.dslErrors = this.dslErrorsProp;
      },
      deep: true,
    },
  },
  methods: {
    postDslForValidation,
    validateDsl() {
      this.dslBeingValidated = "active";
      this.dslErrors = [];
      try {
        this.dsl = getDsl(this.allNodes, this.allEdges);
        this.postDslForValidation();
      } catch (error) {
        this.dslInvalid = true;
        this.dslInvalidTitle = error.message;
      }
    },
  },
};
</script>
