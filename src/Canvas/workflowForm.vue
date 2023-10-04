<template>
  <bx-accordion>
    <bx-accordion-item open title-text="Overview">
      <bx-input
        data-modal-primary-focus
        placeholder="Workflow name"
        @blur="onFocusLost($event, name)"
        @input="name = $event.target.value"
        :value="name"
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
        :value="description"
        @input="description = $event.target.value"
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
        :value="parentNodeLabel + ' (ID: ' + parentNodeID + ')'"
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
      v-if="parameters != undefined"
      :title-text="'Parameters (' + parameters.length + ')'"
    >
      <bx-table-toolbar>
        <bx-table-toolbar-content>
          <bx-btn kind="primary" @click="addParameter()"
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
            v-for="(parameter, index) in parameters"
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
                @click="removeParameter(index)"
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
      :title-text="'Steps (' + Object.keys(steps).length + ')'"
    >
      <bx-structured-list>
        <bx-structured-list-head>
          <bx-structured-list-header-row>
            <bx-structured-list-header-cell
              >Step</bx-structured-list-header-cell
            >
            <bx-structured-list-header-cell
              >Definition</bx-structured-list-header-cell
            >
          </bx-structured-list-header-row>
        </bx-structured-list-head>
        <bx-structured-list-body>
          <bx-structured-list-row
            v-for="(stepDefinition, step) in steps"
            :key="step"
          >
            <bx-structured-list-cell class="updateModals">
              <bx-input
                placeholder="Step"
                :value="step"
                @input="stepsDictionary[step] = $event.target.value"
                colorScheme="light"
              >
                <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
                <span slot="helper-text">Steps have to be unique</span>
              </bx-input>
            </bx-structured-list-cell>
            <bx-structured-list-cell class="updateModals">
              <bx-input
                readonly
                placeholder="Step definition"
                :value="stepDefinition"
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
                @click="removeStep(step)"
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
import { createWorkflowNode } from "@/Canvas/canvasFunctions";

export default {
  props: { node: Object, parentNode: Object, allNodes: Object },
  emits: ["update", "removeParent", "stepDeleted"],
  data() {
    return {
      name: "",
      description: "",
      parameters: [],
      steps: {},
      //to store the original steps against the new steps set by the user
      stepsDictionary: {},
      parentNodeID: "",
      parentNodeLabel: "",
      siblingNodes: {},
      isError: false,
    };
  },
  mounted() {
    if (this.parentNode != undefined) {
      this.parentNodeID = this.parentNode.id;
      this.parentNodeLabel = this.parentNode.label;
    }
    if (this.node != undefined) {
      this.name = this.node.definition.signature.name;
      this.description = this.node.definition.signature.description;
      this.parameters = [...this.node.definition.signature.parameters];
      this.steps = { ...this.node.definition.steps };
      Object.keys(this.steps).forEach((s) => {
        //have the original step as the object key and also the default value
        //the object value will be changed later to reflect the user changes
        this.stepsDictionary[s] = s;
      });
      this.siblingNodes = this.allNodes.filter(
        (node) => node.parentNode == this.node.id,
      );
    }
  },
  methods: {
    removeParent() {
      this.$emit("removeParent");
    },
    addParameter() {
      this.parameters.push({ name: "", default: "" });
    },
    removeParameter(index) {
      this.parameters.splice(index, 1);
    },
    removeStep(step) {
      delete this.steps[step];
      delete this.stepsDictionary[step];
      //remove this block from the parent workflow (Un nest it)
      let tobeUpdatedNode = this.siblingNodes.find(
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
          this.name,
          this.description,
          this.parameters,
        );
        this.$emit("workflowAdded", workflowNode, inputNode);
      }
    },
    update() {
      if (!this.isError) {
        //make sure the steps are unique by adding them to
        //a Set which can only contain unique values
        let uniqueSteps = new Set(Object.values(this.stepsDictionary));
        //to store the new user set steps
        //We use a new object instead of updating the existing object to preserve order
        //as updating an object key requires deleting the original key-value pair and adding a new one
        //which changes the order of the steps in the original object
        let newSteps = {};
        if (Object.values(this.stepsDictionary).length != uniqueSteps.size) {
          alert("Please make sure steps are unique");
        } else {
          Object.keys(this.stepsDictionary).forEach((oldStep) => {
            let newStep = this.stepsDictionary[oldStep];
            //Check if the step has changed
            if (newStep != oldStep) {
              //If it did then add a new key (the new step) and the original value
              this.updateStepId(oldStep, newStep);
              newSteps[newStep] = this.steps[oldStep];
            } else {
              //if it didn't then add the original key-value pain to the new object
              newSteps[oldStep] = this.steps[oldStep];
            }
          });
          //we copy over the props to avoid mutating
          let updatedWorkflow = { ...this.node };
          updatedWorkflow.label = this.name;
          updatedWorkflow.definition.signature.name = this.name;
          //If name changed we have to update the input node name
          updatedWorkflow.definition.signature.description = this.description;
          updatedWorkflow.definition.signature.parameters = this.parameters;
          updatedWorkflow.definition.steps = newSteps;
          this.$emit("update", updatedWorkflow);
        }
      }
    },
    updateStepId(oldStep, newStep) {
      let tobeUpdatedNode = this.siblingNodes.find(
        (node) => node.stepId == oldStep,
      );
      tobeUpdatedNode.stepId = newStep;
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
