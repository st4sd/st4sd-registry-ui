<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <cds-accordion>
    <cds-accordion-item open title="Overview">
      <cds-text-input
        class="cds-theme-zone-g10"
        id="createWorkflowSidePanel"
        label="Workflow name (Required)"
        placeholder="Workflow name"
        @blur="onFocusLost($event, workflow.getName())"
        @mouseleave="onFocusLost($event, workflow.getName())"
        :value="workflow.getName()"
        @input="updateWorkflowName($event.target.value)"
        invalidText="Name cannot be empty"
        required
      />
      <br />
      <cds-text-input
        class="cds-theme-zone-g10"
        label="Workflow description"
        placeholder="Description"
        :value="workflow.getDescription()"
        @input="workflow.setDescription($event.target.value)"
      />
      <br />
      <cds-text-input
        class="cds-theme-zone-g10"
        v-if="this.parentNode != undefined"
        label="Parent Workflow:"
        readonly
        :value="parentNode.label"
      />
      <br />
      <cds-button
        v-if="this.parentNode != undefined"
        kind="primary"
        @click="removeParent()"
        >Unnest</cds-button
      >
    </cds-accordion-item>
    <cds-accordion-item
      open
      v-if="workflow.getParameters() != undefined"
      :title="'Parameters (' + workflow.getParameters().length + ')'"
    >
      <cds-structured-list v-if="workflow.getParameters().length != 0">
        <cds-structured-list-head>
          <cds-structured-list-header-row>
            <cds-structured-list-header-cell
              >Name</cds-structured-list-header-cell
            >
            <cds-structured-list-header-cell
              >Default: Could be string, int, number or object (currenly only
              handles string)</cds-structured-list-header-cell
            >
            <cds-structured-list-header-cell></cds-structured-list-header-cell>
          </cds-structured-list-header-row>
        </cds-structured-list-head>
        <cds-structured-list-body>
          <cds-structured-list-row
            v-for="(parameter, index) in workflow.getParameters()"
            :key="index"
          >
            <cds-structured-list-cell>
              <cds-text-input
                class="cds-theme-zone-g10"
                placeholder="parameter name"
                :value="parameter.name"
                @input="parameter.name = $event.target.value"
                :invalid="parameterNameIsDuplicate(parameter.name)"
                invalidText="Parameter names must be unique"
              />
            </cds-structured-list-cell>
            <cds-structured-list-cell>
              <cds-text-input
                class="cds-theme-zone-g10"
                placeholder="parameter default"
                :value="parameter.default"
                @input="parameter.default = $event.target.value"
              />
            </cds-structured-list-cell>
            <cds-structured-list-cell class="align-top">
              <cds-icon-button
                kind="danger"
                enter-delay-ms="1000"
                leave-delay-ms="0"
                align="bottom"
                @click="workflow.removeParameter(index)"
              >
                <img
                  slot="icon"
                  class="white-svg"
                  height="18"
                  width="18"
                  src="@/assets/remove.svg"
                />
                <p slot="tooltip-content">Remove item</p>
              </cds-icon-button>
            </cds-structured-list-cell>
          </cds-structured-list-row>
        </cds-structured-list-body>
      </cds-structured-list>
      <cds-button
        style="padding: 10px"
        kind="primary"
        @click="workflow.addParameter()"
      >
        Add Parameter
        <img
          slot="icon"
          class="white-svg"
          height="18"
          width="18"
          src="@/assets/plus.svg"
        />
      </cds-button>
    </cds-accordion-item>
    <cds-accordion-item
      v-if="node != undefined"
      :title="'Steps (' + workflow.getNumberOfSteps() + ')'"
    >
      <cds-structured-list v-if="workflow.getStepsArray().length != 0">
        <cds-structured-list-head>
          <cds-structured-list-header-row>
            <cds-structured-list-header-cell
              >Step</cds-structured-list-header-cell
            >
            <cds-structured-list-header-cell
              >Reference</cds-structured-list-header-cell
            >
          </cds-structured-list-header-row>
        </cds-structured-list-head>
        <cds-structured-list-body>
          <cds-structured-list-row
            v-for="(step, index) in workflow.getStepsArray()"
            :key="index"
          >
            <cds-structured-list-cell>
              <cds-text-input
                class="cds-theme-zone-g10"
                helperText="Steps have to be unique"
                placeholder="Step"
                :value="step.step"
                @input="workflow.setStep(index, $event.target.value)"
              />
            </cds-structured-list-cell>
            <cds-structured-list-cell>
              <cds-text-input
                class="cds-theme-zone-g10"
                readonly
                placeholder="Step reference"
                :value="step.stepReference"
              />
            </cds-structured-list-cell>
            <cds-structured-list-cell class="align-top">
              <cds-icon-button
                kind="danger"
                enter-delay-ms="1000"
                leave-delay-ms="0"
                align="bottom"
                @click="removeStep(index)"
              >
                <img
                  slot="icon"
                  class="white-svg"
                  height="18"
                  width="18"
                  src="@/assets/remove.svg"
                />
                <p slot="tooltip-content">Remove item</p>
              </cds-icon-button>
            </cds-structured-list-cell>
          </cds-structured-list-row>
        </cds-structured-list-body>
      </cds-structured-list>
      <cds-inline-notification
        v-else
        low-contrast
        hide-close-button
        kind="info"
        title="No components in this workflow"
        subtitle="Drag and drop components on the workflow to add them."
      >
      </cds-inline-notification>
    </cds-accordion-item>
  </cds-accordion>
</template>

<script>
import St4sdWorkflow from "@/canvas/classes/St4sdWorkflow.js";
import { createWorkflowNode } from "@/canvas/functions/canvasFunctions";
import { updateNodeLabel } from "@/canvas/functions/updateNodeLabel";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/button.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/accordion.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/structured-list.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/icon-button.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/notification.min.js";

export default {
  props: { node: Object, parentNode: Object, allNodes: Object },
  emits: [
    "update",
    "removeParent",
    "stepDeleted",
    "workflowAdded",
    "nameChanged",
    "validityChanged",
  ],
  data() {
    return {
      workflow: new St4sdWorkflow(),
      childrenNodes: [],
      isNameError: false,
      isParameterError: false,
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
      if (!this.isNameError && !this.isParameterError) {
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
      if (!this.isNameError && !this.isParameterError) {
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
    // TODO: AP: see warning on parameterNameIsDuplicate in componentForm.vue
    parameterNameIsDuplicate(name) {
      let parametersNames = this.workflow
        .getParameters()
        .map((param) => param.name);
      if (new Set(parametersNames).size != parametersNames.length) {
        let occurrences = 0;
        for (let parameter of parametersNames) {
          if (parameter == name) {
            occurrences++;
            if (occurrences > 1) {
              this.isParameterError = true;
              this.$emit("validityChanged", true);
              return true;
            }
          }
        }
      } else {
        this.isParameterError = false;
        this.$emit("validityChanged", this.isNameError);
        return false;
      }
    },
    onFocusLost(event, item) {
      if (item == "") {
        event.target.invalid = true;
        this.isNameError = true;
      } else {
        this.isNameError = false;
        event.target.invalid = false;
      }
      this.$emit("validityChanged", this.isNameError || this.isParameterError);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/svg.scss";
@import "@/styles/delete-button-icon-inside-cell-style.css";
@import "@/styles/cds-structured-list-styles.css";
</style>
