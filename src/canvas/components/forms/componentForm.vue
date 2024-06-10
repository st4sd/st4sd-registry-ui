<template>
  <div>
    <bx-accordion>
      <bx-accordion-item title-text="Overview" open>
        <cds-text-input
          class="cds-theme-zone-g10"
          label="Component name (Required)"
          data-modal-primary-focus
          :value="component.signature.name"
          @input="updateComponentName($event.target.value)"
          @blur="onFocusLost($event, component.signature.name)"
          placeholder="name"
          required
          invalidText="Name cannot be empty"
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
        <bx-btn
          v-if="componentHasParent"
          kind="tertiary"
          @click="removeParentNode()"
          >Unnest from workflow</bx-btn
        >
      </bx-accordion-item>
      <bx-accordion-item
        open
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
                >Default: Could be string, int, number or object (currenly only
                handles string)</bx-structured-list-header-cell
              >
            </bx-structured-list-header-row>
          </bx-structured-list-head>
          <bx-structured-list-body>
            <bx-structured-list-row
              v-for="(parameter, index) in component.signature.parameters"
              :key="index"
            >
              <bx-structured-list-cell class="updateModals">
                <cds-text-input
                  class="cds-theme-zone-g10"
                  :value="parameter.name"
                  @input="parameter.name = $event.target.value"
                  :invalid="parameterNameIsDuplicate(parameter.name)"
                  invalidText="Parameter names must be unique"
                  placeholder="parameter name"
                />
              </bx-structured-list-cell>
              <bx-structured-list-cell class="updateModals">
                <cds-text-input
                  class="cds-theme-zone-g10"
                  :value="parameter.default"
                  @input="parameter.default = $event.target.value"
                  placeholder="parameter default"
                />
              </bx-structured-list-cell>
              <bx-structured-list-cell
                class="updateModals structured-list-delete-button-bottom"
              >
                <bx-btn kind="danger" @click="component.removeParameter(index)">
                  <img
                    class="white-svg"
                    height="18"
                    width="18"
                    src="@/assets/remove.svg"
                  />
                </bx-btn>
              </bx-structured-list-cell>
            </bx-structured-list-row>
          </bx-structured-list-body>
          <bx-btn kind="primary" @click="component.addParameter()">
            Add Parameter +
          </bx-btn>
        </bx-structured-list>
      </bx-accordion-item>
      <bx-accordion-item title-text="Command">
        <cds-text-input
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
      </bx-accordion-item>
      <bx-accordion-item title-text="Workflow Attributes">
        <cds-text-input
          label="Replicate:"
          class="cds-theme-zone-g10"
          :value="component.workflowAttributes.replicate"
          @input="component.workflowAttributes.replicate = $event.target.value"
          placeholder="replicate"
        />
        <br />
        <bx-toggle
          :checked="component.workflowAttributes.aggregate"
          checked-text="True"
          label-text="Aggregate:"
          unchecked-text="False"
          @bx-toggle-changed="!component.workflowAttributes.aggregate"
        ></bx-toggle>
        <br />
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
                <cds-text-input
                  label="Restart Hook On:"
                  class="cds-theme-zone-g10"
                  :value="restartHook"
                  @input="restartHook = $event.target.value"
                  placeholder="restart hook name"
                />
              </bx-structured-list-cell>
              <bx-structured-list-cell
                class="structured-list-delete-button structured-list-delete-button-bottom"
              >
                <bx-btn
                  kind="danger"
                  @click="component.removeRestartHookOn(index)"
                >
                  <img
                    class="white-svg"
                    height="18"
                    width="18"
                    src="@/assets/remove.svg"
                  />
                </bx-btn>
              </bx-structured-list-cell>
            </bx-structured-list-row>
          </bx-structured-list-body>
          <bx-btn kind="primary" @click="component.addRestartHookOn()">
            Add
          </bx-btn>
        </bx-structured-list>

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
          @input="
            component.workflowAttributes.maxRestarts = $event.target.value
          "
          placeholder="max restarts"
        />
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
                <cds-text-input
                  label="Shutdown On:"
                  class="cds-theme-zone-g10"
                  :value="shutdownOn"
                  @input="shutdownOn = $event.target.value"
                  placeholder="shutdown on"
                />
              </bx-structured-list-cell>
              <bx-structured-list-cell
                class="structured-list-delete-button structured-list-delete-button-bottom"
              >
                <bx-btn
                  kind="danger"
                  @click="component.removeShutdownOn(index)"
                >
                  <img
                    class="white-svg"
                    height="18"
                    width="18"
                    src="@/assets/remove.svg"
                  />
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
      </bx-accordion-item>
      <bx-accordion-item title-text="Resource Request">
        <cds-text-input
          label="Number of Processes:"
          class="cds-theme-zone-g10"
          :value="component.resourceRequest.numberProcesses"
          @input="
            component.resourceRequest.numberProcesses = $event.target.value
          "
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
          @input="
            component.resourceRequest.threadsPerCore = $event.target.value
          "
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
      </bx-accordion-item>
      <bx-accordion-item
        :title-text="'Variables (' + variableKeys.length + ')'"
      >
        <bx-btn kind="primary" @click="addVariables">Add Variable +</bx-btn>
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
                <cds-text-input
                  class="cds-theme-zone-g10"
                  id="add-component-variables-input"
                  type="text"
                  :value="key"
                  @input="setVariableKey(idx, $event.target.value)"
                  :invalid="checkKeyIsDuplicate(idx, key)"
                  invalidText="Variable names must be unique"
                  placeholder="variable name"
                />
              </bx-structured-list-cell>
              <bx-structured-list-cell class="updateModals">
                <cds-text-input
                  class="cds-theme-zone-g10"
                  id="add-component-variables-input"
                  type="text"
                  :value="variableValues[idx]"
                  @input="setVariableValue(idx, $event.target.value)"
                  placeholder="variable value"
                />
              </bx-structured-list-cell>
              <bx-structured-list-cell
                class="updateModals structured-list-delete-button-bottom"
              >
                <bx-btn kind="danger" @click="removeVariable(idx)">
                  <img
                    class="white-svg"
                    height="18"
                    width="18"
                    src="@/assets/remove.svg"
                  />
                </bx-btn>
              </bx-structured-list-cell>
            </bx-structured-list-row>
          </bx-structured-list-body>
        </bx-structured-list>
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

// AP: see comment on parameterNameIsDuplicate
// import { checkParameterNameIsDuplicate } from "@/canvas/functions/validation";

let invalidVariables = {};

export default {
  props: { node: Object, allNodes: Object },
  emits: ["update", "removeParent", "add", "invalid", "nameChanged"],
  data() {
    return {
      contentSwitcherSelection: ref("config"),
      component: new St4sdComponent(),
      isNameError: false,
      isParameterError: false,
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
  computed: {
    componentHasParent() {
      let componentNode = this.allNodes?.find(
        (node) => node.id == this.node.id,
      );
      return componentNode?.parentNode != undefined;
    },
  },
  methods: {
    update() {
      if (!this.isNameError && !this.isParameterError) {
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
      if (!this.isNameError && !this.isParameterError) {
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
    // TODO: AP: using this function raises
    // [Vue warn]: Maximum recursive updates exceeded.
    // This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself.
    // Possible sources include component template, render function, updated hook or watcher source function.
    // in St4sdComponent.js:319 or componentForm.vue:71
    // parameterNameIsDuplicate(name) {
    //   let parameterNames = this.component
    //     .getParameters()
    //     .map((param) => param.name);
    //   this.isParameterError = checkParameterNameIsDuplicate(
    //     parameterNames,
    //     name,
    //   );
    //   this.$emit("invalid", this.isNameError || this.isParameterError);
    //   return this.isParameterError;
    // },
    parameterNameIsDuplicate(name) {
      let parametersNames = this.component
        .getParameters()
        .map((param) => param.name);
      if (new Set(parametersNames).size != parametersNames.length) {
        let occurrences = 0;
        for (let parameter of parametersNames) {
          if (parameter == name) {
            occurrences++;
            if (occurrences > 1) {
              this.isParameterError = true;
              this.$emit("invalid", true);
              return true;
            }
          }
        }
      } else {
        this.isParameterError = false;
        this.$emit("invalid", this.isNameError);
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
      this.$emit("invalid", this.isNameError);
    },
    addVariables() {
      this.variableKeys.push("");
      this.variableValues.push("");
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
@import "@/styles/svg.scss";
@import "@/styles/bx-structured-list-styles.css";
@import "@/styles/bx-accordion-styles.css";
@import "@/styles/bx-modal-styles.css";
</style>
