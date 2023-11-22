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
import axios from "axios";

import "@carbon/web-components/es/components/inline-loading/index.js";

import { getDsl } from "@/canvas/functions/downloadJSON";
import { getDeploymentEndpoint } from "@/functions/public_path";

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
    postDslForValidation() {
      if (this.dsl != null) {
        axios
          .post(
            `${getDeploymentEndpoint()}registry-ui/backend/canvas/dsl/validate`,
            this.dsl,
          )
          .then((response) => {
            if (response.status == 200) {
              this.dslBeingValidated = "finished";
              this.dslInvalid = false;
              this.$emit("dslValidationError", []);
            }
          })
          .catch((error) => {
            this.dslBeingValidated = "error";
            this.dslInvalid = true;
            this.dslInvalidTitle = error.response.data.message;
            this.dslMessage =
              "There are errors in the DSL validation, click the show errors button to see them";
            this.dslErrors = error.response.data.problems;
            this.$emit("dslValidationError", this.dslErrors);
          });
      }
    },
  },
};
</script>
