<template>
  <bx-modal open>
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading
        >Add <u>{{ toBeNestedNode.label }}</u> to a workflow</bx-modal-heading
      >
    </bx-modal-header>
    <bx-modal-body>
      <p>Choose a workflow:</p>
      <br />
      <bx-radio-button-group
        name="nestOptions"
        orientation="vertical"
        :value="selectedWorkflowId"
        @bx-radio-button-group-changed="
          selectedWorkflowId = $event.detail.value
        "
      >
        <template v-for="(node, i) in nestingWorkflows" :key="i">
          <bx-radio-button
            :label-text="node.label"
            :value="node.id"
          ></bx-radio-button>
        </template>
      </bx-radio-button-group>
      <br />
      <div v-if="this.selectedWorkflowId != ''">
        <bx-input
          helperText="Please make sure the step name is unique"
          placeholder="Write your step name here"
          :value="stepName"
          @input="stepName = $event.target.value"
          @blur="onFocusLost($event, stepName)"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text"
            >What do you want to name <u>{{ toBeNestedNode.label }}</u> step in
            <u>{{ getSelectedWorkflow().label }}</u> workflow:</span
          >
        </bx-input>
        <br />
        <p>
          <u>{{ this.selectedWorkflow.label }}</u> steps: <br />
          <b v-if="stepName == ''">....... </b>
          <b v-else>{{ stepName }}</b
          >:
          {{ this.toBeNestedNode.label }}
          <br />
          <template v-for="step in Object.keys(allSteps)" :key="step">
            <b>{{ step }}</b
            >: {{ allSteps[step] }}
            <br />
          </template>
        </p>
      </div>
    </bx-modal-body>

    <bx-modal-footer>
      <bx-modal-footer-button
        kind="secondary"
        data-modal-close
        @click="resetSelection"
        >Cancel</bx-modal-footer-button
      >

      <bx-modal-footer-button kind="primary" type="submit" @click="nest"
        >Submit</bx-modal-footer-button
      >
    </bx-modal-footer>
  </bx-modal>
</template>

<script>
import "@carbon/web-components/es/components/radio-button/index.js";
import { updateNodeLabel } from "@/canvas/functions/updateNodeLabel";

export default {
  props: {
    nestingWorkflows: Object,
    toBeNestedNode: Object,
    allNodes: Object,
  },
  emits: ["done", "nestedNode", "updatedWorkflow"],
  data() {
    return {
      allSteps: null,
      selectedWorkflow: "",
      selectedWorkflowId: "",
      stepExecuteModalActive: false,
      edge: "",
      stepName: "",
      isError: false,
    };
  },
  mounted() {
    if (this.nestingWorkflows.length == 1) {
      this.selectedWorkflowId = this.nestingWorkflows[0].id;
    }
  },
  methods: {
    getSelectedWorkflow() {
      this.selectedWorkflow = this.allNodes.find(
        (n) => n.id == this.selectedWorkflowId,
      );
      this.allSteps = this.selectedWorkflow.definition.steps;
      return this.selectedWorkflow;
    },
    nest() {
      if (!this.isError) {
        if (this.selectedWorkflowId == "") {
          alert("please make a selection");
        } else {
          if (this.isUnique(this.stepName)) {
            let nestedNode = this.allNodes.find(
              (n) => n.id == this.toBeNestedNode.id,
            );
            nestedNode.parentNode = this.selectedWorkflow.id;
            nestedNode.expandParent = true;
            nestedNode.position = { x: 0, y: 0 };
            nestedNode.stepId = this.stepName;
            updateNodeLabel(nestedNode);
            if (nestedNode.type == "workflow") {
              //change workflow input node name
              this.allNodes.find(
                (node) =>
                  node.type == "workflow-input" &&
                  node.parentNode == nestedNode.id,
              ).label = `${nestedNode.label} inputs`;
            }
            this.selectedWorkflow.definition.steps[this.stepName] =
              nestedNode.definition.signature.name;
            this.$emit("done");
          } else {
            alert("Please choose a unique step name");
          }
        }
      }
    },
    isUnique(step) {
      let duplicateSteps = Object.keys(this.allSteps).filter(
        (i) => i.toLowerCase() === step.toLowerCase(),
      );
      if (duplicateSteps.length > 0) {
        return false;
      } else {
        return true;
      }
    },
    onFocusLost(event, item) {
      if (item == "") {
        event.target.invalid = true;
        this.isError = true;
      } else {
        this.isError = false;
        event.target.invalid = false;
      }
    },
  },
};
</script>
