<template>
  <bx-modal open class="no-transform">
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
        :open="!dslInvalid"
        title="DSL Valid"
      />
      <bx-inline-notification
        id="dsl-invalid-notification"
        kind="error"
        :open="dslInvalid"
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
      <bx-modal-footer-button kind="secondary" data-modal-close
        >Cancel</bx-modal-footer-button
      >
      <bx-modal-footer-button
        kind="primary"
        type="submit"
        @click="registerExperiment()"
        :disabled="nameInvalid || dslInvalid"
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
  emits: ["finished"],
  data() {
    return {
      experimentName: null,
      dsl: null,
      nameInvalid: true,
      dslInvalid: null,
      dslInvalidTitle: null,
      dslMessage: null,
      dslBeingValidated: "active",
    };
  },
  mounted() {
    this.entryNode = this.allNodes.find((node) => node.isEntry == true);
    if (this.validateDsl()) {
      if (this.name.trim().length == 0) {
        this.experimentName = this.dsl.entrypoint["entry-instance"];
      } else {
        this.experimentName = this.name;
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
          })
          .catch((error) => {
            this.dslBeingValidated = "error";
            this.dslInvalid = true;
            this.dslInvalidTitle = error.response.data.message;
            this.dslMessage = `Message: ${error.response.data.problems.map(
              (problem) => problem.msg,
            )}\nType: ${error.response.data.problems.map(
              (problem) => problem.type,
            )}`;
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
