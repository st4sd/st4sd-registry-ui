<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <cds-side-panel
    open
    size="lg"
    includeOverlay="true"
    :title="`Add <${toBeNestedNode.label}> to a workflow`"
    @cds-side-panel-closed="$emit('side-panel-closed')"
  >
    <div>
      <p>Choose a workflow:</p>
      <br />
      <cds-radio-button-group
        name="nestOptions"
        orientation="vertical"
        :value="selectedWorkflowId"
        @cds-radio-button-group-changed="
          selectedWorkflowId = $event.detail.value
        "
      >
        <template v-for="(node, i) in nestingWorkflows" :key="i">
          <cds-radio-button
            :label-text="node.label"
            :value="node.id"
          ></cds-radio-button>
        </template>
      </cds-radio-button-group>
      <br />
      <div v-if="this.selectedWorkflowId != ''">
        <p>
          Choose the step name that the
          <u>{{ toBeNestedNode.label }}</u> component should have in the
          <u>{{ getSelectedWorkflow().label }}</u> workflow:
        </p>
        <cds-text-input
          helperText="Please make sure the step name is unique"
          placeholder="Write your step name here"
          label="Step name"
          :value="stepName"
          @input="stepName = $event.target.value"
          @blur="onFocusLost($event, stepName)"
        />
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
    </div>
    <cds-button
      slot="actions"
      kind="secondary"
      @click="$emit('side-panel-closed')"
      >Cancel</cds-button
    >
    <cds-button kind="primary" type="submit" slot="actions" @click="nest">
      Submit
    </cds-button>
  </cds-side-panel>
</template>

<script>
import "@carbon/web-components/es/components/radio-button/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/side-panel/index.js";
import "@carbon/web-components/es/components/text-input/index.js";
import { updateNodeLabel } from "@/canvas/functions/updateNodeLabel";

export default {
  props: {
    nestingWorkflows: Object,
    toBeNestedNode: Object,
    allNodes: Object,
  },
  emits: ["done", "nestedNode", "updatedWorkflow", "side-panel-closed"],
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
          if (
            this.isUnique(this.stepName) &&
            this.stepName.trim().length >= 1
          ) {
            let nestedNode = this.allNodes.find(
              (n) => n.id == this.toBeNestedNode.id,
            );
            //nestedNode.extent is used as a way to preserve the node position after nesting
            nestedNode.extent = "parent";
            nestedNode.expandParent = true;
            nestedNode.parentNode = this.selectedWorkflow.id;
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
            if (this.isUnique(this.stepName)) {
              alert("Step name must be 1 charaters or longer");
            } else {
              alert("Please choose a unique step name");
            }
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
