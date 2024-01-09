<template>
  <bx-accordion>
    <bx-accordion-item open title-text="Overview">
      <bx-input
        data-modal-primary-focus
        placeholder="Workflow name"
        @blur="onFocusLost($event, workflow.getName())"
        :value="workflow.getName()"
        @input="updateWorkflowName($event.target.value)"
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
      <br />
      <bx-input
        v-if="this.parentNode != undefined"
        readonly
        :value="parentNode.label"
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
      open
      v-if="workflow.getParameters() != undefined"
      :title-text="'Parameters (' + workflow.getParameters().length + ')'"
    >
      <bx-structured-list>
        <bx-structured-list-head>
          <bx-structured-list-header-row>
            <bx-structured-list-header-cell
              >Name</bx-structured-list-header-cell
            >
            <bx-structured-list-header-cell
              >Default: Could be string, int, number or object (currenly only
              handles string)</bx-structured-list-header-cell
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
                <img src="@/assets/remove.svg" />
              </bx-btn>
            </bx-structured-list-cell>
          </bx-structured-list-row>
        </bx-structured-list-body>
        <bx-btn kind="primary" @click="workflow.addParameter()">
          Add Parameter +
        </bx-btn>
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
                <img src="@/assets/remove.svg" />
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
  emits: [
    "update",
    "removeParent",
    "stepDeleted",
    "workflowAdded",
    "nameChanged",
  ],
  data() {
    return {
      workflow: new St4sdWorkflow(),
      childrenNodes: [],
      isError: false,
      oldName: "",
      removedSteps: [],
    };
  },
  mounted() {
    if (this.node != undefined) {
      this.workflow.setWorkflowDefinition(this.node.definition);
      this.oldName = this.workflow.getName();
      this.childrenNodes = this.allNodes.filter(
        (node) =>
          node.parentNode == this.node.id && node.type != "workflow-input",
      );
      this.workflow.setStepsNodeIDs(this.childrenNodes);
    }
  },
  methods: {
    removeParent() {
      this.$emit("removeParent");
    },
    updateWorkflowName(newName) {
      this.workflow.setName(newName);
      this.$emit("nameChanged", newName);
    },
    removeStep(index) {
      let step = this.workflow.getStep(index).step;
      this.removedSteps.push(step);
      this.workflow.removeStep(index);
    },
    applyStepRemoval() {
      this.removedSteps.forEach((removedStep) => {
        //remove this block from the parent workflow (Un nest it)
        let tobeUpdatedNode = this.childrenNodes.find(
          (node) => node.stepId == removedStep,
        );
        tobeUpdatedNode.parentNode = undefined;
        tobeUpdatedNode.expandParent = false;
        tobeUpdatedNode.extent = undefined;
        delete tobeUpdatedNode.stepId;
        this.updateNodeLabel(tobeUpdatedNode);
        this.$emit("stepDeleted", tobeUpdatedNode);
      });
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
          this.applyStepRemoval();
          this.checkStepsChanges();
          //chec steps definition to see if any steps got removed
          let updatedWorkflow = this.allNodes.find(
            (node) => node.id == this.node.id,
          );
          //if the workflow name has changed we need to change step references
          //check if the workflow is a step in another workflow
          if (
            this.oldName != this.workflow.getName() &&
            updatedWorkflow.stepId != undefined
          ) {
            let parentNode = this.allNodes.find(
              (node) => node.id == updatedWorkflow.parentNode,
            );
            parentNode.definition.steps[updatedWorkflow.stepId] =
              this.workflow.getName();
          }
          updatedWorkflow.definition = this.workflow.getWorkflowDefinition();
          this.updateNodeLabel(updatedWorkflow);
          this.$emit("update", updatedWorkflow);
        } else {
          alert("Please make sure steps are unique");
        }
      }
    },
    checkStepsChanges() {
      this.workflow.getStepsArray().forEach((newStep) => {
        let tobeUpdatedNode = this.childrenNodes.find(
          (node) => node.id == newStep.nodeId,
        );
        if (newStep.step != tobeUpdatedNode.stepId) {
          this.updateStepId(tobeUpdatedNode, newStep.step);
        }
      });
    },
    updateStepId(tobeUpdatedNode, newStep) {
      tobeUpdatedNode.stepId = newStep;
      this.updateNodeLabel(tobeUpdatedNode);
    },
    updateNodeLabel(tobeUpdatedNode) {
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
