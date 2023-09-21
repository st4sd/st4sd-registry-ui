<template>
  <bx-modal open>
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading data-modal-primary-focus
        >Update component details</bx-modal-heading
      >
    </bx-modal-header>
    <bx-modal-body>
      <componentForm
        :nodeDefinition="nodeDefinition"
        :parentNode="this.parentNode"
        :formEmitted="this.formEmitted"
        @updateDefinition="setComponentDefinition"
        @removeParent="removeParentNode"
      />
      <br />
      <bx-btn kind="danger" @click="emitDelete">
        Delete this component &nbsp;
        <img class="trash-can-icon" src="@/assets/trash-can.svg" />
      </bx-btn>
    </bx-modal-body>
    <bx-modal-footer>
      <bx-modal-footer-button kind="secondary" data-modal-close>
        Cancel
      </bx-modal-footer-button>
      <bx-modal-footer-button
        kind="primary"
        type="submit"
        @click="this.formEmitted = true"
      >
        Save
      </bx-modal-footer-button>
    </bx-modal-footer>
  </bx-modal>
</template>

<script>
import componentForm from "@/Canvas/componentForm.vue";
import * as valid from "@/Canvas/validation";

export default {
  components: {
    componentForm,
  },
  props: { title: String, node: Object, parentNode: Object },
  emits: ["updated", "delete", "removeParent"],
  data() {
    return {
      formEmitted: false,
      stepID: "",
      nodeDefinition: {
        name: "",
        command: {
          executable: "",
          arguments: "",
          expandArgument: "",
          environment: "",
        },
        stage: "",
        variables: "",
        references: [""],
        workflowAttributes: {
          replicate: "",
          aggregate: true,
          restartHookFile: "",
          restartHookOn: ["ResourceExhausted"],
          repeatInterval: "",
          repeatRetries: "",
          maxRestarts: "",
          shutdownOn: [""],
        },
        config: { backend: "", walltime: "" },
        lsf: {
          statusRequestInterval: "20",
          queue: "",
          reservation: "",
          resourceString: "",
          dockerImage: "",
          dockerProfileApp: "",
          dockerOption: "",
        },
        kubernetes: {
          image: "",
          imagePullSecret: "",
          gracePeriod: "",
          podSpec: "",
          apiKeyVar: "",
          host: "",
          namespace: "",
          cpuUnitsPerCore: "",
        },
        resourceRequest: {
          numberProcesses: "",
          numberThreads: "",
          ranksPerNode: "",
          threadsPerCore: "",
          memory: "",
          gpus: "",
        },
        signature: {
          name: "",
          description: "",
          parameters: [{ name: "", default: "" }],
        },
      },
    };
  },
  mounted() {
    this.setNodeDefinition(this.node);
  },
  methods: {
    emitDelete() {
      this.$emit("delete");
    },
    removeParentNode() {
      this.$emit("removeParent");
    },
    setComponentDefinition(definition) {
      this.formEmitted = false;
      this.nodeDefinition = definition;
      this.update();
    },
    update() {
      let selectedNode = { ...this.node };
      selectedNode.label = this.nodeDefinition.name;
      selectedNode.definition.command = this.nodeDefinition.command;
      selectedNode.definition.stage = this.nodeDefinition.stage;
      selectedNode.definition.variables = this.nodeDefinition.variables;
      selectedNode.definition.references = this.nodeDefinition.references;
      selectedNode.definition.workflowAttributes =
        this.nodeDefinition.workflowAttributes;
      selectedNode.definition.resourceManager = {};
      Object.defineProperties(selectedNode.definition.resourceManager, {
        config: {
          value: this.nodeDefinition.config,
        },
        lsf: {
          value: this.nodeDefinition.lsf,
        },
        kubernetes: {
          value: this.nodeDefinition.kubernetes,
        },
      });
      selectedNode.definition.resourceRequest =
        this.nodeDefinition.resourceRequest;
      selectedNode.definition.signature = this.nodeDefinition.signature;
      this.$emit("updated", selectedNode);
    },
    setNodeDefinition(node) {
      if (node == undefined) {
        return "";
      } else {
        this.nodeDefinition = {
          name: node.label,
          command: valid.validateCommand(node),
          stage: valid.validateStage(node),
          variables: valid.validateVariables(node),
          references: valid.validateReferences(node),
          workflowAttributes: valid.validateWorkflowAttributes(node),
          config: valid.validateConfig(node),
          lsf: valid.validateLsf(node),
          kubernetes: valid.validateKubernetes(node),
          resourceRequest: valid.validateResourceRequest(node),
          signature: valid.validateSignature(node),
        };
      }
    },
  },
};
</script>
<style lang="css" scoped>
@import "@/styles/bx-structured-list-styles.css";
@import "@/styles/bx-accordion-styles.css";
@import "@/styles/bx-modal-styles.css";

.trash-can-icon {
  max-height: 18px;
  max-width: 18px;
  width: 100%;
  height: 100%;
  margin: 0rem;
  -webkit-filter: invert(0.99);
  filter: invert(0.99);
}
</style>
