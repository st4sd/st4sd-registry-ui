<template>
  <bx-accordion>
    <bx-accordion-item open title-text="Overview">
      <bx-input
        data-modal-primary-focus
        placeholder="Workflow name"
        @blur="onFocusLost($event, workflow.getName())"
        :value="workflow.getName()"
        @input="workflow.setName($event.target.value)"
        validityMessage="Name cannot be empty"
        required
        colorScheme="light"
      >
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
        <span slot="label-text">Workflow name (Required)</span>
      </bx-input>
      <br />
      <bx-input
        placeholder="Description"
        :value="workflow.getDescription()"
        @input="workflow.setDescription($event.target.value)"
        colorScheme="light"
      >
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
        <span slot="label-text">Workflow description</span>
      </bx-input>
      <bx-input
        v-if="node != undefined"
        readonly
        :value="node.id"
        colorScheme="light"
      >
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
        <span slot="label-text">Workflow ID</span>
      </bx-input>
      <br />
      <bx-input
        v-if="this.parentNode != undefined"
        readonly
        :value="parentNode.label + ' (ID: ' + parentNode.id + ')'"
        colorScheme="light"
      >
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
        <span slot="label-text">Parent Workflow:</span>
      </bx-input>
      <br />
      <bx-btn
        v-if="this.parentNode != undefined"
        kind="primary"
        @click="removeParent()"
        >Unnest</bx-btn
      >
    </bx-accordion-item>
    <bx-accordion-item
      :open="node == undefined"
      v-if="workflow.getParameters() != undefined"
      :title-text="'Parameters (' + workflow.getParameters().length + ')'"
    >
      <bx-table-toolbar>
        <bx-table-toolbar-content>
          <bx-btn kind="primary" @click="workflow.addParameter()"
            >Add Parameter +</bx-btn
          >
        </bx-table-toolbar-content>
      </bx-table-toolbar>
      <bx-structured-list>
        <bx-structured-list-head>
          <bx-structured-list-header-row>
            <bx-structured-list-header-cell
              >Name</bx-structured-list-header-cell
            >
            <bx-structured-list-header-cell
              >Default</bx-structured-list-header-cell
            >
            <bx-structured-list-header-cell></bx-structured-list-header-cell>
          </bx-structured-list-header-row>
        </bx-structured-list-head>
        <bx-structured-list-body>
          <bx-structured-list-row
            v-for="(parameter, index) in workflow.getParameters()"
            :key="index"
          >
            <bx-structured-list-cell class="updateModals">
              <bx-input
                placeholder="parameter name"
                :value="parameter.name"
                @input="parameter.name = $event.target.value"
                colorScheme="light"
              >
              </bx-input>
            </bx-structured-list-cell>
            <bx-structured-list-cell class="updateModals">
              <bx-input
                placeholder="parameter default"
                :value="parameter.default"
                @input="parameter.default = $event.target.value"
                colorScheme="light"
              >
              </bx-input>
            </bx-structured-list-cell>
            <bx-structured-list-cell
              class="updateModals structured-list-delete-button-bottom"
            >
              <bx-btn
                class="button-inside-cell"
                kind="danger"
                @click="workflow.removeParameter(index)"
              >
                <img class="trash-can-icon" src="@/assets/trash-can.svg" />
              </bx-btn>
            </bx-structured-list-cell>
          </bx-structured-list-row>
        </bx-structured-list-body>
      </bx-structured-list>
    </bx-accordion-item>
    <bx-accordion-item
      v-if="node != undefined"
      :title-text="'Steps (' + workflow.getNumberOfSteps() + ')'"
    >
      <bx-structured-list>
        <bx-structured-list-head>
          <bx-structured-list-header-row>
            <bx-structured-list-header-cell
              >Step</bx-structured-list-header-cell
            >
            <bx-structured-list-header-cell
              >Reference</bx-structured-list-header-cell
            >
          </bx-structured-list-header-row>
        </bx-structured-list-head>
        <bx-structured-list-body>
          <bx-structured-list-row
            v-for="(step, index) in workflow.getStepsArray()"
            :key="index"
          >
            <bx-structured-list-cell class="updateModals">
              <bx-input
                placeholder="Step"
                :value="step.step"
                @input="workflow.setStep(index, $event.target.value)"
                colorScheme="light"
              >
                <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
                <span slot="helper-text">Steps have to be unique</span>
              </bx-input>
            </bx-structured-list-cell>
            <bx-structured-list-cell class="updateModals">
              <bx-input
                readonly
                placeholder="Step reference"
                :value="step.stepReference"
                colorScheme="light"
              >
              </bx-input>
            </bx-structured-list-cell>
            <bx-structured-list-cell
              class="updateModals structured-list-delete-button-middle"
            >
              <bx-btn
                class="button-inside-cell"
                kind="danger"
                @click="removeStep(index)"
              >
                <img class="trash-can-icon" src="@/assets/trash-can.svg" />
              </bx-btn>
            </bx-structured-list-cell>
          </bx-structured-list-row>
        </bx-structured-list-body>
      </bx-structured-list>
    </bx-accordion-item>
  </bx-accordion>
</template>

<script>
import "@carbon/web-components/es/components/structured-list/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/input/index.js";
import St4sdWorkflow from "@/canvas/classes/St4sdWorkflow.js";
import { createWorkflowNode } from "@/canvas/functions/canvasFunctions";
import { updateNodeLabel } from "@/canvas/functions/updateNodeLabel";

export default {
  props: { node: Object, parentNode: Object, allNodes: Object },
  emits: ["update", "removeParent", "stepDeleted", "workflowAdded"],
  data() {
    return {
      workflow: new St4sdWorkflow(),
      childrenNodes: {},
      isError: false,
    };
  },
  mounted() {
    if (this.node != undefined) {
      this.workflow.setWorkflowDefinition(this.node.definition);
      this.childrenNodes = this.allNodes.filter(
        (node) => node.parentNode == this.node.id,
      );
    }
  },
  methods: {
    removeParent() {
      this.$emit("removeParent");
    },
    removeStep(index) {
      let step = this.workflow.getStep(index).step;
      this.workflow.removeStep(index);
      //remove this block from the parent workflow (Un nest it)
      let tobeUpdatedNode = this.childrenNodes.find(
        (node) => node.stepId == step,
      );
      tobeUpdatedNode.parentNode = undefined;
      tobeUpdatedNode.expandParent = false;
      this.$emit("stepDeleted", tobeUpdatedNode);
    },
    add() {
      if (!this.isError) {
        //Each workflow will generate a workflow node and an input node  for that workflow
        let { workflowNode, inputNode } = createWorkflowNode(
          this.workflow.getName(),
          this.workflow.getDescription(),
          this.workflow.getParameters(),
        );
        this.$emit("workflowAdded", workflowNode, inputNode);
      }
    },
    update() {
      if (!this.isError) {
        if (this.workflow.areStepsUnique()) {
          this.checkStepsChanges();
          //we copy over the props to avoid mutating
          let updatedWorkflow = this.allNodes.find(
            (node) => node.id == this.node.id,
          );
          updatedWorkflow.definition = this.workflow.getWorkflowDefinition();
          updateNodeLabel(updatedWorkflow);
          //change workflow input node name
          this.allNodes.find(
            (node) =>
              node.type == "workflow-input" &&
              node.parentNode == updatedWorkflow.id,
          ).label = `${updatedWorkflow.label} inputs`;
          this.$emit("update", updatedWorkflow);
        } else {
          alert("Please make sure steps are unique");
        }
      }
    },
    checkStepsChanges() {
      this.workflow.getStepsArray().forEach((newStep) => {
        let oldStep = Object.keys(this.node.definition.steps).find(
          (key) => this.node.definition.steps[key] === newStep.stepReference,
        );
        if (newStep.step != oldStep) {
          this.updateStepId(oldStep, newStep.step);
        }
      });
    },
    updateStepId(oldStep, newStep) {
      let tobeUpdatedNode = this.childrenNodes.find(
        (node) => node.stepId == oldStep,
      );
      tobeUpdatedNode.stepId = newStep;
      updateNodeLabel(tobeUpdatedNode);
      if (tobeUpdatedNode.type == "workflow") {
        //change workflow input node name
        this.allNodes.find(
          (node) =>
            node.type == "workflow-input" &&
            node.parentNode == tobeUpdatedNode.id,
        ).label = `${tobeUpdatedNode.label} inputs`;
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
<style lang="css" scoped>
@import "@/styles/delete-button-icon-inside-cell-style.css";
@import "@/styles/bx-structured-list-styles.css";
@import "@/styles/bx-accordion-styles.css";
@import "@/styles/bx-modal-styles.css";
</style>
