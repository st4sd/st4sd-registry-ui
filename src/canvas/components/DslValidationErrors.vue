<template>
  <div>
    <cds-inline-loading
      v-if="dslBeingValidated == 'active'"
      :status="dslBeingValidated"
      >Validating DSL...</cds-inline-loading
    >
    <cds-button v-else @click="validateDsl" style="padding-bottom: 15px"
      >Re-run Validation</cds-button
    >
    <cds-inline-notification
      id="dsl-valid"
      kind="success"
      :open="dslBeingValidated != 'active' && dslErrorsData.length == 0"
      hide-close-button
      title="DSL Valid"
    />
    <cds-accordion data-modal-primary-focus>
      <cds-accordion-item
        v-for="(problem, idx) in dslErrorsData"
        :key="idx"
        :title="`Problem ${idx + 1}`"
        :open="idx == 0"
      >
        <pre>{{ JSON.stringify(problem, undefined, 2) }}</pre>
      </cds-accordion-item>
    </cds-accordion>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/inline-loading/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/accordion/index.js";
import "@carbon/web-components/es/components/notification/index.js";

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
<style scoped lang="scss">
pre {
  white-space: pre-wrap;
  font-size: small;
}
</style>
