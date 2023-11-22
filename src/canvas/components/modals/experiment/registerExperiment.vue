<template>
  <bx-modal open>
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading>Register experiment</bx-modal-heading>
    </bx-modal-header>
    <bx-modal-body>
      <bx-inline-loading
        v-show="dslBeingValidated == 'active'"
        :status="dslBeingValidated"
        >Validating DSL...</bx-inline-loading
      >
      <bx-inline-notification
        id="dsl-valid"
        kind="success"
        :open="dslBeingValidated != 'active' && !dslInvalid"
        hide-close-button
        title="DSL Valid"
      />
      <bx-inline-notification
        id="dsl-invalid-notification"
        kind="error"
        :open="dslInvalid"
        hide-close-button
        :title="dslInvalidTitle"
        :subtitle="dslMessage"
      />
      <bx-input
        placeholder="your-experiment-name"
        colorScheme="light"
        @input="validateExperimentName"
        :value="experimentName"
        :invalid="nameInvalid"
        :disabled="dslInvalid"
        validity-message="Experiment names should only consist of lower case letters, numbers, and - to separate words e.g. name-1"
      >
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <span slot="label-text">Experiment name:</span>
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      </bx-input>
      <br />
    </bx-modal-body>
    <bx-modal-footer>
      <bx-modal-footer-button
        data-modal-close
        kind="tertiary"
        @click="$emit('openShowDslErrors')"
        :disabled="!dslInvalid"
        >Show Errors</bx-modal-footer-button
      >
      <bx-modal-footer-button kind="secondary" data-modal-close
        >Cancel</bx-modal-footer-button
      >
      <bx-modal-footer-button
        kind="primary"
        type="submit"
        @click="registerExperiment()"
        :disabled="dslBeingValidated == 'active' || nameInvalid || dslInvalid"
        >Register Experiment</bx-modal-footer-button
      >
    </bx-modal-footer>
  </bx-modal>
</template>

<script>
import "@carbon/web-components/es/components/modal/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/input/index.js";

import { getDsl } from "@/canvas/functions/downloadJSON";
import { validateExperimentName } from "@/canvas/functions/validateExperimentName";

import axios from "axios";

import { getDeploymentEndpoint } from "@/functions/public_path";

//Stores
import { canvasStore } from "@/canvas/stores/canvasStore";

export default {
  props: {
    name: String,
    allNodes: Object,
    allEdges: Object,
  },
  emits: ["openShowDslErrors", "dslValidationError"],
  data() {
    return {
      experimentName: null,
      dsl: null,
      nameInvalid: true,
      dslInvalid: null,
      dslInvalidTitle: null,
      dslMessage: "",
      dslBeingValidated: "active",
      dslErrors: null,
      edit: null,
    };
  },
  mounted() {
    this.entryNode = this.allNodes.find((node) => node.isEntry == true);
    if (this.validateDsl()) {
      if (this.name.trim().length == 0) {
        this.experimentName = this.dsl.entrypoint["entry-instance"];
        this.edit = false;
      } else {
        this.experimentName = this.name;
        this.edit = true;
      }
      this.nameInvalid = validateExperimentName(this.experimentName);
    }
  },
  methods: {
    validateDsl() {
      try {
        this.dsl = getDsl(this.allNodes, this.allEdges);
        this.postDslForValidation();
        return true;
      } catch (error) {
        this.dslBeingValidated = "finished";
        this.dslInvalid = true;
        this.dslInvalidTitle = error.message;
        return false;
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
              canvasStore.setDsl(this.dsl);
              canvasStore.setGraph({
                nodes: this.allNodes,
                edges: this.allEdges,
              });
            }
            this.$emit("dslValidationError", []);
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
    validateExperimentName(event) {
      this.experimentName = event.target.value;
      this.nameInvalid = validateExperimentName(this.experimentName);
    },
    registerExperiment() {
      if (!this.dslInvalid) {
        this.$router.push({
          name: "register experiment",
          query: {
            edit: this.edit,
          },
          params: {
            name: this.experimentName,
          },
        });
      }
    },
  },
};
</script>
<style lang="css" scoped>
@import "@/styles/bx-modal-styles.css";
#loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
