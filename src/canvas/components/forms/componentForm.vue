<template>
  <div>
    <bx-accordion>
      <bx-accordion-item title-text="Overview" open>
        <bx-input
          data-modal-primary-focus
          :value="component.signature.name"
          @input="component.signature.name = $event.target.value"
          @blur="onFocusLost($event, component.signature.name)"
          placeholder="name"
          required
          validityMessage="Name cannot be empty"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">Component name (Required)</span>
        </bx-input>
        <br />
        <bx-input
          :value="component.signature.description"
          @input="component.signature.description = $event.target.value"
          placeholder="description"
          required
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">Description:</span>
        </bx-input>
        <br />
        <bx-input
          v-if="parentNode != undefined"
          readonly
          :value="parentNode.label"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">Parent Workflow:</span>
        </bx-input>
        <bx-btn
          v-if="parentNode != undefined"
          kind="primary"
          @click="removeParentNode()"
          >Unnest</bx-btn
        >
      </bx-accordion-item>
      <bx-accordion-item
        :title-text="'Variables (' + variableKeys.length + ')'"
      >
        <bx-table-toolbar>
          <bx-table-toolbar-content>
            <bx-btn kind="primary" @click="addVariables">Add Variable +</bx-btn>
          </bx-table-toolbar-content>
        </bx-table-toolbar>
        <bx-structured-list v-if="variableKeys.length != 0">
          <bx-structured-list-head>
            <bx-structured-list-header-row>
              <bx-structured-list-header-cell
                >Name</bx-structured-list-header-cell
              >
              <bx-structured-list-header-cell
                >Value</bx-structured-list-header-cell
              >
              <bx-structured-list-header-cell></bx-structured-list-header-cell>
            </bx-structured-list-header-row>
          </bx-structured-list-head>
          <bx-structured-list-body>
            <bx-structured-list-row
              v-for="(key, idx) in variableKeys"
              :key="idx"
            >
              <bx-structured-list-cell class="updateModals">
                <bx-input
                  id="add-component-variables-input"
                  type="text"
                  :value="key"
                  @input="setVariableKey(idx)"
                  :invalid="checkKeyIsDuplicate(idx, key)"
                  validity-message="Variable names must be unique"
                  placeholder="variable name"
                  colorScheme="light"
                >
                </bx-input>
              </bx-structured-list-cell>
              <bx-structured-list-cell class="updateModals">
                <bx-input
                  id="add-component-variables-input"
                  type="text"
                  :value="variableValues[idx]"
                  @input="setVariableValue(idx)"
                  placeholder="variable value"
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
                  @click="removeVariable(idx)"
                >
                  <img src="@/assets/remove.svg" />
                </bx-btn>
              </bx-structured-list-cell>
            </bx-structured-list-row>
          </bx-structured-list-body>
        </bx-structured-list>
      </bx-accordion-item>
      <bx-accordion-item
        :title-text="
          'Parameters (' + component.signature.parameters.length + ')'
        "
      >
        <bx-structured-list>
          <bx-structured-list-head>
            <bx-structured-list-header-row>
              <bx-structured-list-header-cell
                >Name</bx-structured-list-header-cell
              >
              <bx-structured-list-header-cell
                >Default</bx-structured-list-header-cell
              >
            </bx-structured-list-header-row>
          </bx-structured-list-head>
          <bx-structured-list-body>
            <bx-structured-list-row
              v-for="(parameter, index) in component.signature.parameters"
              :key="index"
            >
              <bx-structured-list-cell class="updateModals">
                <bx-input
                  :value="parameter.name"
                  @input="parameter.name = $event.target.value"
                  placeholder="parameter name"
                  colorScheme="light"
                >
                  <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
                  <span slot="label-text"> Parameter {{ index }} name:</span>
                </bx-input>
              </bx-structured-list-cell>
              <bx-structured-list-cell class="updateModals">
                <bx-input
                  :value="parameter.default"
                  @input="parameter.default = $event.target.value"
                  placeholder="parameter default"
                  colorScheme="light"
                >
                  <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
                  <span slot="label-text">
                    Default: Could be string, int, number or object (currenly
                    only handles string)</span
                  >
                </bx-input>
              </bx-structured-list-cell>
              <bx-structured-list-cell
                class="updateModals structured-list-delete-button-bottom"
              >
                <bx-btn
                  class="button-inside-cell"
                  kind="danger"
                  v-if="component.signature.parameters.length > 1"
                  @click="component.removeParameter(index)"
                >
                  <img class="trash-can-icon" src="@/assets/trash-can.svg" />
                </bx-btn>
              </bx-structured-list-cell>
            </bx-structured-list-row>
          </bx-structured-list-body>
          <bx-btn kind="primary" @click="component.addParameter()">
            Add
          </bx-btn>
        </bx-structured-list>
      </bx-accordion-item>
      <bx-accordion-item title-text="Command">
        <bx-input
          :value="component.command.executable"
          @input="component.command.executable = $event.target.value"
          placeholder="executable"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text"> Executable:</span>
        </bx-input>
        <br />
        <bx-input
          :value="component.command.arguments"
          @input="component.command.arguments = $event.target.value"
          placeholder="arguments"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text"> Arguments:</span>
        </bx-input>
        <br />
        <bx-input
          :value="component.command.expandArguments"
          @input="component.command.expandArguments = $event.target.value"
          placeholder="expand argument"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text"> Expand Argument:</span>
        </bx-input>
        <br />
        <bx-input
          :value="component.command.environment"
          @input="component.command.environment = $event.target.value"
          placeholder="environment"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">
            Environment: String or Object(currently only handles string)</span
          >
        </bx-input>
      </bx-accordion-item>
      <bx-accordion-item title-text="Workflow Attributes">
        <bx-input
          :value="component.workflowAttributes.replicate"
          @input="component.workflowAttributes.replicate = $event.target.value"
          placeholder="replicate"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text"> Replicate:</span>
        </bx-input>
        <br />
        <bx-toggle
          :checked="component.workflowAttributes.aggregate"
          checked-text="True"
          label-text="Aggregate:"
          unchecked-text="False"
          @bx-toggle-changed="!component.workflowAttributes.aggregate"
        ></bx-toggle>
        <br />
        <bx-input
          :value="component.workflowAttributes.restartHookFile"
          @input="
            component.workflowAttributes.restartHookFile = $event.target.value
          "
          placeholder="retstart hook file"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">Restart Hook File:</span>
        </bx-input>
        <br />

        <bx-structured-list>
          <bx-structured-list-head>
            <bx-structured-list-header-row>
              <bx-structured-list-header-cell
                >Restart Hooks: ({{
                  component.workflowAttributes.restartHookOn.length
                }})</bx-structured-list-header-cell
              >
            </bx-structured-list-header-row>
          </bx-structured-list-head>
          <bx-structured-list-body>
            <bx-structured-list-row
              v-for="(restartHook, index) in component.workflowAttributes
                .restartHookOn"
              :key="index"
            >
              <bx-structured-list-cell>
                <bx-input
                  :value="restartHook"
                  @input="restartHook = $event.target.value"
                  placeholder="restart hook name"
                  colorScheme="light"
                >
                  <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
                  <span slot="label-text">Restart Hook On:</span>
                </bx-input>
              </bx-structured-list-cell>
              <bx-structured-list-cell class="structured-list-delete-button">
                <bx-btn
                  class="button-inside-cell"
                  kind="danger"
                  v-if="component.workflowAttributes.restartHookOn.length > 1"
                  @click="component.removeRestartHookOn(index)"
                >
                  <img class="trash-can-icon" src="@/assets/trash-can.svg" />
                </bx-btn>
              </bx-structured-list-cell>
            </bx-structured-list-row>
          </bx-structured-list-body>
          <bx-btn kind="primary" @click="component.addRestartHookOn()">
            Add
          </bx-btn>
        </bx-structured-list>

        <bx-input
          :value="component.workflowAttributes.repeatInterval"
          @input="
            component.workflowAttributes.repeatInterval = $event.target.value
          "
          placeholder="repeat interval"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">Repeat Interval:</span>
        </bx-input>
        <br />
        <bx-input
          :value="component.workflowAttributes.repeatRetries"
          @input="
            component.workflowAttributes.repeatRetries = $event.target.value
          "
          placeholder="repeat retries"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">Repeat Retries:</span>
        </bx-input>
        <br />
        <bx-input
          :value="component.workflowAttributes.maxRestarts"
          @input="
            component.workflowAttributes.maxRestarts = $event.target.value
          "
          placeholder="max restarts"
          colorScheme="light"
          label="Max Restarts:"
        >
        </bx-input>

        <bx-structured-list
          v-if="component.workflowAttributes.shutdownOn != undefined"
        >
          <bx-structured-list-head>
            <bx-structured-list-header-row>
              <bx-structured-list-header-cell
                >Shutdown Hooks: ({{
                  component.workflowAttributes.shutdownOn.length
                }})</bx-structured-list-header-cell
              >
            </bx-structured-list-header-row>
          </bx-structured-list-head>
          <bx-structured-list-body
            v-if="component.workflowAttributes.shutdownOn != undefined"
          >
            <bx-structured-list-row
              v-for="(shutdownOn, index) in component.workflowAttributes
                .shutdownOn"
              :key="index"
            >
              <bx-structured-list-cell>
                <bx-input
                  :value="shutdownOn"
                  @input="shutdownOn = $event.target.value"
                  placeholder="shutdown on"
                  colorScheme="light"
                >
                  <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
                  <span slot="label-text">Shutdown On:</span>
                </bx-input>
              </bx-structured-list-cell>
              <bx-structured-list-cell class="structured-list-delete-button">
                <bx-btn
                  class="button-inside-cell"
                  kind="danger"
                  v-if="component.workflowAttributes.shutdownOn.length > 1"
                  @click="component.removeShutdownOn(index)"
                >
                  <img class="trash-can-icon" src="@/assets/trash-can.svg" />
                </bx-btn>
              </bx-structured-list-cell>
            </bx-structured-list-row>
          </bx-structured-list-body>
          <bx-btn kind="primary" @click="component.addShutdownOn()">
            Add
          </bx-btn>
        </bx-structured-list>
      </bx-accordion-item>
      <bx-accordion-item title-text="Resource Manager">
        <bx-content-switcher
          value="config"
          size="sm"
          @bx-content-switcher-selected="
            contentSwitcherSelection = $event.target.value
          "
        >
          <bx-content-switcher-item value="config"
            >Config</bx-content-switcher-item
          >
          <bx-content-switcher-item value="lsf">LSF</bx-content-switcher-item>
          <bx-content-switcher-item value="kubernetes"
            >Kubernetes</bx-content-switcher-item
          >
        </bx-content-switcher>
        <template v-if="contentSwitcherSelection == 'config'">
          <br />
          <bx-input
            :value="component.resourceManager.config.backend"
            @input="
              component.resourceManager.config.backend = $event.target.value
            "
            placeholder="backend"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Backend:</span>
          </bx-input>
          <br />
          <bx-input
            :value="component.resourceManager.config.walltime"
            @input="
              component.resourceManager.config.walltime = $event.target.value
            "
            placeholder="walltime"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Walltime:</span>
          </bx-input>
        </template>
        <template v-if="contentSwitcherSelection == 'lsf'">
          <br />
          <bx-input
            :value="component.resourceManager.lsf.statusRequestInterval"
            @input="
              component.resourceManager.lsf.statusRequestInterval =
                $event.target.value
            "
            placeholder="status request interval"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Status Request Interval:</span>
          </bx-input>
          <br />
          <bx-input
            :value="component.resourceManager.lsf.queue"
            @input="component.resourceManager.lsf.queue = $event.target.value"
            placeholder="queue"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Queue:</span>
          </bx-input>
          <br />
          <bx-input
            :value="component.resourceManager.lsf.reservation"
            @input="
              component.resourceManager.lsf.reservation = $event.target.value
            "
            placeholder="reservation"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Reservation:</span>
          </bx-input>
          <br />
          <bx-input
            :value="component.resourceManager.lsf.resourceString"
            @input="
              component.resourceManager.lsf.resourceString = $event.target.value
            "
            placeholder="resource string"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Resource String:</span>
          </bx-input>
          <br />
          <bx-input
            :value="component.resourceManager.lsf.dockerImage"
            @input="
              component.resourceManager.lsf.dockerImage = $event.target.value
            "
            placeholder="docker image"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Docker Image:</span>
          </bx-input>
          <br />
          <bx-input
            :value="component.resourceManager.lsf.dockerProfileApp"
            @input="
              component.resourceManager.lsf.dockerProfileApp =
                $event.target.value
            "
            placeholder="docker profile app"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Docker Profile App:</span>
          </bx-input>
          <br />
          <bx-input
            :value="component.resourceManager.lsf.dockerOption"
            @input="
              component.resourceManager.lsf.dockerOption = $event.target.value
            "
            placeholder="docker option"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Docker Option:</span>
          </bx-input>
        </template>
        <template v-if="contentSwitcherSelection == 'kubernetes'">
          <br />
          <bx-input
            :value="component.resourceManager.kubernetes.image"
            @input="
              component.resourceManager.kubernetes.image = $event.target.value
            "
            placeholder="image"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Image:</span>
          </bx-input>
          <br />
          <bx-input
            :value="component.resourceManager.kubernetes.imagePullSecret"
            @input="
              component.resourceManager.kubernetes.imagePullSecret =
                $event.target.value
            "
            placeholder="image pull secret"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Image Pull Secret:</span>
          </bx-input>
          <br />
          <bx-input
            :value="component.resourceManager.kubernetes.gracePeriod"
            @input="
              component.resourceManager.kubernetes.gracePeriod =
                $event.target.value
            "
            placeholder="grace period"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Grace Period:</span>
          </bx-input>
          <br />
          <bx-input
            :value="component.resourceManager.kubernetes.podSpec"
            @input="
              component.resourceManager.kubernetes.podSpec = $event.target.value
            "
            placeholder="pod spec"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Pod Spec:</span>
          </bx-input>
          <br />
          <bx-input
            :value="component.resourceManager.kubernetes.apiKeyVar"
            @input="
              component.resourceManager.kubernetes.apiKeyVar =
                $event.target.value
            "
            placeholder="api key var"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Api Key Var:</span>
          </bx-input>
          <br />
          <bx-input
            :value="component.resourceManager.kubernetes.host"
            @input="
              component.resourceManager.kubernetes.host = $event.target.value
            "
            placeholder="host"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Host:</span>
          </bx-input>
          <br />
          <bx-input
            :value="component.resourceManager.kubernetes.namespace"
            @input="
              component.resourceManager.kubernetes.namespace =
                $event.target.value
            "
            placeholder="namespace"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Namespace:</span>
          </bx-input>
          <br />
          <bx-input
            :value="component.resourceManager.kubernetes.cpuUnitsPerCore"
            @input="
              component.resourceManager.kubernetes.cpuUnitsPerCore =
                $event.target.value
            "
            placeholder="cpu units per core"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">CPU Units Per Core:</span>
          </bx-input>
        </template>
      </bx-accordion-item>
      <bx-accordion-item title-text="Resource Request">
        <bx-input
          :value="component.resourceRequest.numberProcesses"
          @input="
            component.resourceRequest.numberProcesses = $event.target.value
          "
          placeholder="number of processes"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">Number of Processes:</span>
        </bx-input>
        <br />
        <bx-input
          :value="component.resourceRequest.numberThreads"
          @input="component.resourceRequest.numberThreads = $event.target.value"
          placeholder="number of threads"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">Number of Threads:</span>
        </bx-input>
        <br />
        <bx-input
          :value="component.resourceRequest.ranksPerNode"
          @input="component.resourceRequest.ranksPerNode = $event.target.value"
          placeholder="ranks per node"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">Ranks per Node:</span>
        </bx-input>
        <br />
        <bx-input
          :value="component.resourceRequest.threadsPerCore"
          @input="
            component.resourceRequest.threadsPerCore = $event.target.value
          "
          placeholder="threads per core"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">Threads per Core:</span>
        </bx-input>
        <br />
        <bx-input
          :value="component.resourceRequest.memory"
          @input="component.resourceRequest.memory = $event.target.value"
          placeholder="memory"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">Memory:</span>
        </bx-input>
        <br />
        <bx-input
          :value="component.resourceRequest.gpus"
          @input="component.resourceRequest.gpus = $event.target.value"
          placeholder="gpus"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">GPUs:</span>
        </bx-input>
      </bx-accordion-item>
    </bx-accordion>
  </div>
</template>

<script>
import { ref } from "vue";
import "@carbon/web-components/es/components/number-input/index.js";
import "@carbon/web-components/es/components/input/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/toggle/index.js";
import "@carbon/web-components/es/components/accordion/index.js";
import St4sdComponent from "@/canvas/classes/St4sdComponent.js";
import { updateNodeLabel } from "@/canvas/functions/updateNodeLabel";

let invalidVariables = {};

export default {
  props: { node: Object, parentNode: Object, allNodes: Object },
  emits: ["update", "removeParent", "add"],
  data() {
    return {
      contentSwitcherSelection: ref("config"),
      component: new St4sdComponent(),
      isError: false,
      oldName: "",
      variableKeys: [],
      variableValues: [],
    };
  },
  mounted() {
    if (this.node != undefined) {
      this.component.setComponentDefintion(this.node.definition);
      this.oldName = this.component.getName();
      if (this.node.definition.variables) {
        this.variableKeys = Object.keys(this.node.definition.variables);
        this.variableValues = Object.values(this.node.definition.variables);
      }
    }
  },
  methods: {
    update() {
      if (!this.isError) {
        this.setVariables();
        let newComponentNode = { ...this.node };
        updateNodeLabel(newComponentNode);
        newComponentNode.definition = this.component.getComponentDefintion();
        //if the workflow name has changed we need to change step references
        //check if the workflow is a step in another workflow
        if (
          this.oldName != this.component.getName() &&
          newComponentNode.stepId != undefined
        ) {
          let parentNode = this.allNodes.find(
            (node) => node.id == newComponentNode.parentNode,
          );
          parentNode.definition.steps[newComponentNode.stepId] =
            this.component.getName();
        }
        this.$emit("update", newComponentNode);
      }
    },
    add() {
      if (!this.isError) {
        this.setVariables();
        this.$emit("add", this.component.getComponentDefintion());
      }
    },
    removeParentNode() {
      this.$emit("removeParent");
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
    addVariables() {
      this.variableKeys.push("");
      this.variableValues.push("");
    },
    removeVariable(idx) {
      this.variableKeys.splice(idx, 1);
      this.variableValues.splice(idx, 1);
    },
    setVariableKey(idx) {
      this.variableKeys[idx] = event.target.value;
    },
    setVariableValue(idx) {
      this.variableValues[idx] = event.target.value;
    },
    setVariables() {
      for (let i = 0; i < this.variableKeys.length; i++) {
        if (
          this.variableKeys[i].trim() != "" &&
          this.variableValues[i].trim() != ""
        )
          this.component.addVariables(
            this.variableKeys[i],
            this.variableValues[i],
          );
      }
    },
    checkKeyIsDuplicate(idx, key) {
      let invalid = this.variableKeys.toSpliced(idx, 1).includes(key);
      if (invalid) {
        invalidVariables[idx] = invalid;
        this.$emit("invalid", invalid);
      } else if (idx in invalidVariables) {
        delete invalidVariables[idx];
        // Only emit an invalidity event with "false"
        // if the invalidVariables dictionary has no keys
        if (Object.keys(invalidVariables).length == 0)
          this.$emit("invalid", invalid);
      }
      return invalid;
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
