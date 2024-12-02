<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <cds-accordion>
    <cds-accordion-item title="Overview" open>
      <cds-text-input
        class="cds-theme-zone-g10 createComponentSidePanel"
        label="Component name (Required)"
        :id="`${node?.id}-signature-name`"
        :value="component.signature.name"
        @input="updateComponentName($event.target.value)"
        placeholder="name"
        required
        :invalid="invalidName"
        :invalidText="nameErrorText"
      />
      <br />
      <cds-text-input
        class="cds-theme-zone-g10"
        label="Description:"
        :value="component.signature.description"
        @input="component.signature.description = $event.target.value"
        placeholder="description"
        required
      />
      <br />
      <cds-button
        v-if="componentHasParent"
        kind="tertiary"
        @click="removeParentNode()"
        >Unnest from workflow</cds-button
      >
    </cds-accordion-item>
    <cds-accordion-item
      id="parameters-accordion-item"
      open
      :title="'Parameters (' + component.signature.parameters.length + ')'"
    >
      <cds-structured-list v-if="component.signature?.parameters.length != 0">
        <cds-structured-list-head>
          <cds-structured-list-header-row>
            <cds-structured-list-header-cell
              >Name</cds-structured-list-header-cell
            >
            <cds-structured-list-header-cell
              >Default: Could be string, int, number or object (currenly only
              handles string)</cds-structured-list-header-cell
            >
          </cds-structured-list-header-row>
        </cds-structured-list-head>
        <cds-structured-list-body>
          <cds-structured-list-row
            v-for="(parameter, index) in component.signature.parameters"
            :key="index"
          >
            <cds-structured-list-cell>
              <cds-text-input
                class="cds-theme-zone-g10"
                :value="parameter.name"
                @input="parameter.name = $event.target.value"
                :invalid="this.invalidParameters.has(index)"
                invalidText="Parameter names must be unique and not empty"
                placeholder="parameter name"
              />
            </cds-structured-list-cell>
            <cds-structured-list-cell>
              <cds-text-input
                class="cds-theme-zone-g10"
                :value="parameter.default"
                @input="parameter.default = $event.target.value"
                placeholder="parameter default"
              />
            </cds-structured-list-cell>
            <cds-structured-list-cell class="align-top">
              <cds-icon-button
                kind="danger"
                enter-delay-ms="1000"
                leave-delay-ms="0"
                align="bottom"
                @click="component.removeParameter(index)"
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
      <br />
      <cds-button kind="primary" @click="addParam()">
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
    <cds-accordion-item title="Command">
      <cds-text-input
        :id="`${node?.id}-command-executable`"
        label="Executable:"
        class="cds-theme-zone-g10"
        :value="component.command.executable"
        @input="component.command.executable = $event.target.value"
        placeholder="executable"
      />
      <br />
      <cds-text-input
        label="Arguments:"
        class="cds-theme-zone-g10"
        :value="component.command.arguments"
        @input="component.command.arguments = $event.target.value"
        placeholder="arguments"
      />
      <br />
      <cds-text-input
        label="Expand Argument:"
        class="cds-theme-zone-g10"
        :value="component.command.expandArguments"
        @input="component.command.expandArguments = $event.target.value"
        placeholder="expand argument"
      />
      <br />
      <cds-text-input
        label="Environment: String or Object(currently only handles string)"
        class="cds-theme-zone-g10"
        :value="component.command.environment"
        @input="component.command.environment = $event.target.value"
        placeholder="environment"
      />
    </cds-accordion-item>
    <cds-accordion-item id="wf-accordion-item" title="Workflow Attributes">
      <cds-text-input
        label="Replicate:"
        class="cds-theme-zone-g10"
        :value="component.workflowAttributes.replicate"
        @input="component.workflowAttributes.replicate = $event.target.value"
        placeholder="replicate"
      />
      <br />
      <cds-toggle
        :checked="component.workflowAttributes.aggregate"
        labelA="True"
        labelText="Aggregate:"
        labelB="False"
        @cds-toggle-changed="!component.workflowAttributes.aggregate"
      />
      <br /><br />
      <cds-text-input
        label="Restart Hook File:"
        class="cds-theme-zone-g10"
        :value="component.workflowAttributes.restartHookFile"
        @input="
          component.workflowAttributes.restartHookFile = $event.target.value
        "
        placeholder="retstart hook file"
      />
      <br />

      <cds-structured-list>
        <cds-structured-list-head>
          <cds-structured-list-header-row>
            <cds-structured-list-header-cell
              >Restart Hooks: ({{
                component.workflowAttributes.restartHookOn.length
              }})</cds-structured-list-header-cell
            >
          </cds-structured-list-header-row>
        </cds-structured-list-head>
        <cds-structured-list-body>
          <cds-structured-list-row
            v-for="(restartHook, index) in component.workflowAttributes
              .restartHookOn"
            :key="index"
          >
            <cds-structured-list-cell>
              <cds-text-input
                label="Restart Hook On:"
                class="cds-theme-zone-g10"
                :value="restartHook"
                @input="restartHook = $event.target.value"
                placeholder="restart hook name"
              />
            </cds-structured-list-cell>
            <cds-structured-list-cell class="align-bottom">
              <cds-icon-button
                kind="danger"
                enter-delay-ms="1000"
                leave-delay-ms="0"
                align="bottom"
                @click="component.removeRestartHookOn(index)"
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
        <br v-if="component.workflowAttributes.restartHookOn.length != 0" />
        <cds-button kind="primary" @click="addRestartHook()">
          Add
          <img
            slot="icon"
            class="white-svg"
            height="18"
            width="18"
            src="@/assets/plus.svg"
          />
        </cds-button>
      </cds-structured-list>
      <br />
      <cds-text-input
        label="Repeat Interval:"
        class="cds-theme-zone-g10"
        :value="component.workflowAttributes.repeatInterval"
        @input="
          component.workflowAttributes.repeatInterval = $event.target.value
        "
        placeholder="repeat interval"
      />
      <br />
      <cds-text-input
        label="Repeat Retries:"
        class="cds-theme-zone-g10"
        :value="component.workflowAttributes.repeatRetries"
        @input="
          component.workflowAttributes.repeatRetries = $event.target.value
        "
        placeholder="repeat retries"
      />
      <br />
      <cds-text-input
        label="Max Restarts:"
        class="cds-theme-zone-g10"
        :value="component.workflowAttributes.maxRestarts"
        @input="component.workflowAttributes.maxRestarts = $event.target.value"
        placeholder="max restarts"
      />
      <cds-structured-list
        v-if="component.workflowAttributes.shutdownOn != undefined"
      >
        <cds-structured-list-head>
          <cds-structured-list-header-row>
            <cds-structured-list-header-cell
              >Shutdown Hooks: ({{
                component.workflowAttributes.shutdownOn.length
              }})</cds-structured-list-header-cell
            >
          </cds-structured-list-header-row>
        </cds-structured-list-head>
        <cds-structured-list-body
          v-if="component.workflowAttributes.shutdownOn != undefined"
        >
          <cds-structured-list-row
            v-for="(shutdownOn, index) in component.workflowAttributes
              .shutdownOn"
            :key="index"
          >
            <cds-structured-list-cell>
              <cds-text-input
                label="Shutdown On:"
                class="cds-theme-zone-g10"
                :value="shutdownOn"
                @input="shutdownOn = $event.target.value"
                placeholder="shutdown on"
              />
            </cds-structured-list-cell>
            <cds-structured-list-cell class="align-bottom">
              <cds-icon-button
                kind="danger"
                enter-delay-ms="1000"
                leave-delay-ms="0"
                align="bottom"
                @click="component.removeShutdownOn(index)"
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
        <br v-if="component.workflowAttributes.shutdownOn.length != 0" />
        <cds-button kind="primary" @click="addShutdown()">
          Add
          <img
            slot="icon"
            class="white-svg"
            height="18"
            width="18"
            src="@/assets/plus.svg"
          />
        </cds-button>
      </cds-structured-list>
    </cds-accordion-item>
    <cds-accordion-item id="rm-accordion-item" title="Resource Manager">
      <cds-content-switcher
        value="config"
        size="sm"
        @cds-content-switcher-selected="contentSwitcherChanged"
      >
        <cds-content-switcher-item value="config"
          >Config</cds-content-switcher-item
        >
        <cds-content-switcher-item value="lsf">LSF</cds-content-switcher-item>
        <cds-content-switcher-item value="kubernetes"
          >Kubernetes</cds-content-switcher-item
        >
      </cds-content-switcher>
      <div class="switcherContainer">
        <template v-if="contentSwitcherSelection == 'config'">
          <br />
          <cds-text-input
            label="Backend:"
            class="cds-theme-zone-g10"
            :value="component.resourceManager.config.backend"
            @input="
              component.resourceManager.config.backend = $event.target.value
            "
            placeholder="backend"
          />
          <br />
          <cds-text-input
            label="Walltime:"
            class="cds-theme-zone-g10"
            :value="component.resourceManager.config.walltime"
            @input="
              component.resourceManager.config.walltime = $event.target.value
            "
            placeholder="walltime"
          />
        </template>
        <template v-if="contentSwitcherSelection == 'lsf'">
          <br />
          <cds-text-input
            label="Status Request Interval:"
            class="cds-theme-zone-g10"
            :value="component.resourceManager.lsf.statusRequestInterval"
            @input="
              component.resourceManager.lsf.statusRequestInterval =
                $event.target.value
            "
            placeholder="status request interval"
          />
          <br />
          <cds-text-input
            label="Queue:"
            class="cds-theme-zone-g10"
            :value="component.resourceManager.lsf.queue"
            @input="component.resourceManager.lsf.queue = $event.target.value"
            placeholder="queue"
          />
          <br />
          <cds-text-input
            label="Reservation:"
            class="cds-theme-zone-g10"
            :value="component.resourceManager.lsf.reservation"
            @input="
              component.resourceManager.lsf.reservation = $event.target.value
            "
            placeholder="reservation"
          />
          <br />
          <cds-text-input
            label="Resource String:"
            class="cds-theme-zone-g10"
            :value="component.resourceManager.lsf.resourceString"
            @input="
              component.resourceManager.lsf.resourceString = $event.target.value
            "
            placeholder="resource string"
          />
          <br />
          <cds-text-input
            label="Docker Image:"
            class="cds-theme-zone-g10"
            :value="component.resourceManager.lsf.dockerImage"
            @input="
              component.resourceManager.lsf.dockerImage = $event.target.value
            "
            placeholder="docker image"
          />
          <br />
          <cds-text-input
            label="Docker Profile App:"
            class="cds-theme-zone-g10"
            :value="component.resourceManager.lsf.dockerProfileApp"
            @input="
              component.resourceManager.lsf.dockerProfileApp =
                $event.target.value
            "
            placeholder="docker profile app"
          />
          <br />
          <cds-text-input
            label="Docker Option:"
            class="cds-theme-zone-g10"
            :value="component.resourceManager.lsf.dockerOption"
            @input="
              component.resourceManager.lsf.dockerOption = $event.target.value
            "
            placeholder="docker option"
          />
        </template>
        <template v-if="contentSwitcherSelection == 'kubernetes'">
          <br />
          <cds-text-input
            label="Image:"
            class="cds-theme-zone-g10"
            :value="component.resourceManager.kubernetes.image"
            @input="
              component.resourceManager.kubernetes.image = $event.target.value
            "
            placeholder="image"
          />
          <br />
          <cds-text-input
            label="Image Pull Secret:"
            class="cds-theme-zone-g10"
            :value="component.resourceManager.kubernetes.imagePullSecret"
            @input="
              component.resourceManager.kubernetes.imagePullSecret =
                $event.target.value
            "
            placeholder="image pull secret"
          />
          <br />
          <cds-text-input
            label="Grace Period:"
            class="cds-theme-zone-g10"
            :value="component.resourceManager.kubernetes.gracePeriod"
            @input="
              component.resourceManager.kubernetes.gracePeriod =
                $event.target.value
            "
            placeholder="grace period"
          />
          <br />
          <cds-text-input
            label="Pod Spec:"
            class="cds-theme-zone-g10"
            :value="component.resourceManager.kubernetes.podSpec"
            @input="
              component.resourceManager.kubernetes.podSpec = $event.target.value
            "
            placeholder="pod spec"
          />
          <br />
          <cds-text-input
            label="Api Key Var:"
            class="cds-theme-zone-g10"
            :value="component.resourceManager.kubernetes.apiKeyVar"
            @input="
              component.resourceManager.kubernetes.apiKeyVar =
                $event.target.value
            "
            placeholder="api key var"
          />
          <br />
          <cds-text-input
            label="Host:"
            class="cds-theme-zone-g10"
            :value="component.resourceManager.kubernetes.host"
            @input="
              component.resourceManager.kubernetes.host = $event.target.value
            "
            placeholder="host"
          />
          <br />
          <cds-text-input
            label="Namespace:"
            class="cds-theme-zone-g10"
            :value="component.resourceManager.kubernetes.namespace"
            @input="
              component.resourceManager.kubernetes.namespace =
                $event.target.value
            "
            placeholder="namespace"
          />
          <br />
          <cds-text-input
            label="CPU Units Per Core:"
            class="cds-theme-zone-g10"
            :value="component.resourceManager.kubernetes.cpuUnitsPerCore"
            @input="
              component.resourceManager.kubernetes.cpuUnitsPerCore =
                $event.target.value
            "
            placeholder="cpu units per core"
          />
        </template>
      </div>
    </cds-accordion-item>
    <cds-accordion-item title="Resource Request">
      <cds-text-input
        label="Number of Processes:"
        class="cds-theme-zone-g10"
        :value="component.resourceRequest.numberProcesses"
        @input="component.resourceRequest.numberProcesses = $event.target.value"
        placeholder="number of processes"
      />
      <br />
      <cds-text-input
        label="Number of Thread:"
        class="cds-theme-zone-g10"
        :value="component.resourceRequest.numberThreads"
        @input="component.resourceRequest.numberThreads = $event.target.value"
        placeholder="number of threads"
      />
      <br />
      <cds-text-input
        label="Ranks per Node:"
        class="cds-theme-zone-g10"
        :value="component.resourceRequest.ranksPerNode"
        @input="component.resourceRequest.ranksPerNode = $event.target.value"
        placeholder="ranks per node"
      />
      <br />
      <cds-text-input
        label="Threads per Core:"
        class="cds-theme-zone-g10"
        :value="component.resourceRequest.threadsPerCore"
        @input="component.resourceRequest.threadsPerCore = $event.target.value"
        placeholder="threads per core"
      />
      <br />
      <cds-text-input
        label="Memory:"
        class="cds-theme-zone-g10"
        :value="component.resourceRequest.memory"
        @input="component.resourceRequest.memory = $event.target.value"
        placeholder="memory"
      />
      <br />
      <cds-text-input
        label="GPUs:"
        class="cds-theme-zone-g10"
        :value="component.resourceRequest.gpus"
        @input="component.resourceRequest.gpus = $event.target.value"
        placeholder="gpus"
      />
    </cds-accordion-item>
    <cds-accordion-item
      id="variables-accordion-item"
      :title="'Variables (' + variableKeys.length + ')'"
    >
      <cds-structured-list v-if="variableKeys.length != 0">
        <cds-structured-list-head>
          <cds-structured-list-header-row>
            <cds-structured-list-header-cell
              >Name</cds-structured-list-header-cell
            >
            <cds-structured-list-header-cell
              >Value</cds-structured-list-header-cell
            >
            <cds-structured-list-header-cell></cds-structured-list-header-cell>
          </cds-structured-list-header-row>
        </cds-structured-list-head>
        <cds-structured-list-body>
          <cds-structured-list-row
            v-for="(key, idx) in variableKeys"
            :key="idx"
          >
            <cds-structured-list-cell>
              <cds-text-input
                class="cds-theme-zone-g10"
                id="add-component-variables-input"
                type="text"
                :value="key"
                @input="setVariableKey(idx, $event.target.value)"
                :invalid="this.invalidVariableKeys.has(idx)"
                invalidText="Variable names must be unique and not empty"
                placeholder="variable name"
              />
            </cds-structured-list-cell>
            <cds-structured-list-cell>
              <cds-text-input
                class="cds-theme-zone-g10"
                id="add-component-variables-input"
                type="text"
                :value="variableValues[idx]"
                @input="setVariableValue(idx, $event.target.value)"
                :invalid="this.invalidVariableValues.has(idx)"
                invalidText="Variables must have a value"
                placeholder="variable value"
              />
            </cds-structured-list-cell>
            <cds-structured-list-cell class="align-top">
              <cds-icon-button
                kind="danger"
                enter-delay-ms="1000"
                leave-delay-ms="0"
                align="bottom"
                @click="removeVariable(idx)"
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
      <br />
      <cds-button kind="primary" @click="addVariables"
        >Add Variable
        <img
          slot="icon"
          class="white-svg"
          height="18"
          width="18"
          src="@/assets/plus.svg"
        />
      </cds-button>
    </cds-accordion-item>
  </cds-accordion>
</template>

<script>
import { ref } from "vue";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/toggle/index.js";
import "@carbon/web-components/es/components/accordion/index.js";
import "@carbon/web-components/es/components/content-switcher/index.js";
import St4sdComponent from "@/canvas/classes/St4sdComponent.js";
import { fixAccordionStyle } from "@/functions/cds_accordion_fixes";
import { updateNodeLabel } from "@/canvas/functions/updateNodeLabel";
import "@carbon/web-components/es/components/structured-list/index.js";
import "@carbon/web-components/es/components/icon-button/index.js";
import { canvasStore } from "@/canvas/stores/canvasStore";
import { applyErrorsToForm } from "@/canvas/functions/dslErrors.js";
// AP: see comment on parameterNameIsDuplicate
// import { checkParameterNameIsDuplicate } from "@/canvas/functions/validation";

export default {
  props: { node: Object, allNodes: Object },
  emits: ["update", "removeParent", "add", "invalid", "nameChanged"],
  data() {
    return {
      contentSwitcherSelection: ref("config"),
      component: new St4sdComponent(),
      hasInvalidName: false,
      hasInvalidParameterNames: false,
      hasInvalidVariableNames: false,
      hasInvalidVariableValues: false,
      oldName: "",
      variableKeys: [],
      variableValues: [],
      errorArr: canvasStore.formErrors,
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
    this.$nextTick(() => {
      applyErrorsToForm(this.errorArr);
    });
  },
  computed: {
    invalidName() {
      let result = false;
      this.hasInvalidName = false;
      this.nameErrorText = "Name is invalid";
      if (this.component.signature.name?.trim() == "") {
        this.nameErrorText = "Name cannot be empty";
        this.hasInvalidName = true;
        result = true;
      }
      this.emitValidityStatus();
      return result;
    },
    componentHasParent() {
      let componentNode = this.allNodes?.find(
        (node) => node.id == this.node.id,
      );
      return componentNode?.parentNode != undefined;
    },
    invalidParameters() {
      let invalid = new Set();
      for (
        let idx = 0;
        idx < this.component.signature.parameters.length;
        idx++
      ) {
        let currentParameter =
          this.component.signature.parameters[idx].name.trim();
        if (currentParameter == "") {
          invalid.add(idx);
          continue;
        }
        if (
          this.component.signature.parameters
            .toSpliced(idx, 1)
            .map((parameter) => parameter.name)
            .includes(currentParameter)
        ) {
          invalid.add(idx);
        }
      }
      return invalid;
    },
    invalidVariableKeys() {
      let invalid = new Set();
      for (let idx = 0; idx < this.variableKeys.length; idx++) {
        let currentVariable = this.variableKeys[idx].trim();
        if (currentVariable == "") {
          invalid.add(idx);
          continue;
        }
        if (this.variableKeys.toSpliced(idx, 1).includes(currentVariable)) {
          invalid.add(idx);
        }
      }
      return invalid;
    },
    invalidVariableValues() {
      let invalid = new Set();
      for (let idx = 0; idx < this.variableValues.length; idx++) {
        let currentValue = this.variableValues[idx].trim();
        if (currentValue == "") {
          invalid.add(idx);
        }
      }
      return invalid;
    },
  },
  watch: {
    invalidParameters(invalidIndices) {
      this.hasInvalidParameterNames = invalidIndices.size != 0;
      this.emitValidityStatus();
    },
    invalidVariableKeys(invalidIndices) {
      this.hasInvalidVariableNames = invalidIndices.size != 0;
      this.emitValidityStatus();
    },
    invalidVariableValues(invalidIndices) {
      this.hasInvalidVariableValues = invalidIndices.size != 0;
      this.emitValidityStatus();
    },
  },
  methods: {
    applyErrorsToForm,
    emitValidityStatus() {
      this.$emit(
        "invalid",
        this.hasInvalidParameterNames ||
          this.hasInvalidName ||
          this.hasInvalidVariableNames ||
          this.hasInvalidVariableValues,
      );
    },
    contentSwitcherChanged(event) {
      this.contentSwitcherSelection = event.target.value;
      fixAccordionStyle("rm-accordion-item");
    },
    update() {
      if (!this.hasInvalidName && !this.hasInvalidParameterNames) {
        this.setVariables();
        let newComponentNode = this.allNodes.find(
          (node) => node.id == this.node.id,
        );
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
        updateNodeLabel(newComponentNode);
        this.$emit("update", newComponentNode);
      }
    },
    add() {
      if (!this.hasInvalidName && !this.hasInvalidParameterNames) {
        this.setVariables();
        this.$emit("add", this.component.getComponentDefintion());
      }
    },
    removeParentNode() {
      this.$emit("removeParent");
    },
    updateComponentName(newName) {
      this.component.signature.name = newName;
      this.$emit("nameChanged", newName);
    },
    addParam() {
      this.component.addParameter();
      fixAccordionStyle("parameters-accordion-item");
    },
    addRestartHook() {
      this.component.addRestartHookOn();
      fixAccordionStyle("wf-accordion-item");
    },
    addShutdown() {
      this.component.addShutdownOn();
      fixAccordionStyle("wf-accordion-item");
    },
    addVariables() {
      this.variableKeys.push("");
      this.variableValues.push("");
      fixAccordionStyle("variables-accordion-item");
    },
    removeVariable(idx) {
      this.variableKeys.splice(idx, 1);
      this.variableValues.splice(idx, 1);
    },
    setVariableKey(idx, value) {
      this.variableKeys[idx] = value;
    },
    setVariableValue(idx, value) {
      this.variableValues[idx] = value;
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
  },
};
</script>
<style lang="scss" scoped>
@use "@/styles/svg.scss";
@use "@/styles/cds-structured-list-styles.css";
</style>
