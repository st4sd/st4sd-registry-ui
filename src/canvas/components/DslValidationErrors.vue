<template>
  <div>
    <bx-inline-loading
      v-if="dslBeingValidated == 'active'"
      :status="dslBeingValidated"
      >Validating DSL...</bx-inline-loading
    >
    <bx-btn v-else @click="validateDsl">Re-run Validation</bx-btn>
    <bx-inline-notification
      id="dsl-valid"
      kind="success"
      :open="dslBeingValidated != 'active' && dslErrorsData.length == 0"
      hide-close-button
      title="DSL Valid"
    />
    <bx-accordion data-modal-primary-focus>
      <bx-accordion-item
        v-for="(problem, idx) in dslErrorsData"
        :key="idx"
        :title-text="`Problem ${idx + 1}`"
        :open="idx == 0"
      >
        <pre>{{ JSON.stringify(problem, undefined, 2) }}</pre>
      </bx-accordion-item>
    </bx-accordion>
  </div>
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
      dslErrorsData: null,
    };
  },
  props: {
    dslErrors: Array,
    allNodes: Object,
    allEdges: Object,
  },
  emits: ["dslValidationError"],
  // Reasoning for what this exists: https://github.ibm.com/st4sd/st4sd-registry-ui/pull/542#issuecomment-81405427
  watch: {
    dslErrors: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler() {
        this.dslErrorsData = this.dslErrors;
      },
      deep: true,
    },
  },
  methods: {
    postDslForValidation,
    validateDsl() {
      this.dslBeingValidated = "active";
      this.dslErrorsData = [];
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
