<template>
  <div>
    <cds-inline-loading
      v-if="dslBeingValidated == 'active'"
      :status="dslBeingValidated"
      >Validating DSL...</cds-inline-loading
    >
    <div class="validationOptions" v-else>
      <cds-button @click="validateDsl">Validate experiment</cds-button>
      <cds-checkbox
        @cds-checkbox-changed="changeAutoDslValidationValue"
        :checked="this.autoDslValidation"
        >Run validation automatically</cds-checkbox
      >
    </div>
    <cds-inline-notification
      id="dsl-valid"
      kind="success"
      :open="dslBeingValidated != 'active' && dslErrorsData.length == 0"
      hide-close-button
      title="DSL Valid"
      lowContrast
    />
    <cds-accordion data-modal-primary-focus>
      <cds-accordion-item
        v-for="(problem, idx) in dslErrorsData"
        :key="idx"
        :title="`Problem ${idx + 1}`"
        :open="idx == 0"
      >
        <pre
          id="dsl-error-human-readable"
          v-if="dslErrorToString(problem, allNodes) != undefined"
          >{{ dslErrorToString(problem, allNodes) }}
        </pre>
        <pre>{{
          JSON.stringify(
            errorLocationToHumanReadable(problem, allNodes),
            undefined,
            2,
          )
        }}</pre>
      </cds-accordion-item>
    </cds-accordion>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/inline-loading/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/accordion/index.js";
import "@carbon/web-components/es/components/notification/index.js";
import "@carbon/web-components/es/components/checkbox/index.js";

import { getDsl } from "@/canvas/functions/downloadJSON";
import { postDslForValidation } from "@/functions/post_dsl_for_validation";
import { findNodeByName } from "@/canvas/functions/canvasFunctions";
import { canvasStore } from "@/canvas/stores/canvasStore";
import {
  errorLocationToHumanReadable,
  dslErrorToString,
} from "@/canvas/functions/dslErrors";

export default {
  data() {
    return {
      dsl: null,
      dslInvalid: null,
      dslInvalidTitle: null,
      dslMessage: "",
      dslBeingValidated: "finished",
      dslErrorsData: null,
      autoDslValidation: false,
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
  mounted() {
    this.autoDslValidation = canvasStore.validateDslAutomatically;
    if (this.autoDslValidation) {
      this.validateDsl();
    }
  },
  methods: {
    postDslForValidation,
    findNodeByName,
    dslErrorToString,
    errorLocationToHumanReadable,
    changeAutoDslValidationValue() {
      this.autoDslValidation = !this.autoDslValidation;
      canvasStore.setAutomaticDslValidation(this.autoDslValidation);
      if (this.autoDslValidation) {
        this.validateDsl();
      }
    },
    validateDsl() {
      this.dslBeingValidated = "active";
      this.dslErrorsData = [];
      try {
        this.dsl = getDsl(this.allNodes, this.allEdges);
        canvasStore.setLatestValidatedDsl(this.dsl);
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
@use "@carbon/layout";

pre {
  white-space: pre-wrap;
  font-size: small;
}

.validationOptions {
  display: inline-flex;
  align-items: baseline;

  cds-button {
    padding-bottom: layout.$spacing-05;
    padding-top: layout.$spacing-05;
  }

  cds-checkbox {
    padding-left: layout.$spacing-05;
  }
}

#dsl-error-human-readable {
  font-style: italic;
}
</style>
