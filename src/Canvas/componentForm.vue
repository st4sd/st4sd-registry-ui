<template>
  <div>
    <bx-accordion>
      <bx-accordion-item data-modal-primary-focus title-text="Overview" open>
        <bx-input
          :value="definition.name"
          @input="definition.name = $event.target.value"
          placeholder="name"
          required
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">Name:</span>
        </bx-input>
        <br />
        <bx-input
          :value="definition.signature.description"
          @input="definition.signature.description = $event.target.value"
          placeholder="description"
          required
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">Description:</span>
        </bx-input>
        <br />
        <bx-number-input
          :value="definition.stage"
          @input="definition.stage = $event.target.value"
          placeholder="0"
          required
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">Stage:</span>
        </bx-number-input>
        <br />
        <bx-input
          id="add-component-variables-input"
          type="text"
          :value="definition.variables"
          @input="definition.variables = $event.target.value"
          placeholder="variables"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">Variables:</span>
        </bx-input>
        <br />
        <bx-input
          v-if="props.parentNode != undefined"
          readonly
          :value="parentNodeLabel + ' (ID: ' + parentNodeID + ')'"
          @input="description = $event.target.value"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">Parent Workflow:</span>
        </bx-input>
        <bx-btn
          v-if="props.parentNode != undefined"
          kind="primary"
          @click="removeParentNode()"
          >Unnest</bx-btn
        >
      </bx-accordion-item>
      <bx-accordion-item
        :title-text="'References (' + componentNumReferences + ')'"
      >
        <bx-structured-list>
          <bx-structured-list-body>
            <bx-structured-list-row
              v-for="n in parseInt(componentNumReferences)"
              :key="n"
            >
              <bx-structured-list-cell class="updateModals">
                <bx-input
                  :value="definition.references[n - 1]"
                  @input="definition.references[n - 1] = $event.target.value"
                  placeholder="reference"
                  colorScheme="light"
                >
                  <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
                  <span slot="label-text">Reference {{ n }}:</span>
                </bx-input>
              </bx-structured-list-cell>
              <bx-structured-list-cell
                class="updateModals structured-list-delete-button-bottom"
              >
                <bx-btn
                  class="button-inside-cell"
                  kind="danger"
                  v-if="componentNumReferences > 1"
                  @click="decrementComponent('refs', n)"
                >
                  <img class="trash-can-icon" src="@/assets/trash-can.svg" />
                </bx-btn>
              </bx-structured-list-cell>
            </bx-structured-list-row>
          </bx-structured-list-body>
          <bx-btn kind="primary" @click="incrementComponent('refs')">
            Add
          </bx-btn>
        </bx-structured-list>
      </bx-accordion-item>
      <bx-accordion-item
        :title-text="'Parameters (' + componentNumParams + ')'"
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
              v-for="n in parseInt(componentNumParams)"
              :key="n"
            >
              <bx-structured-list-cell class="updateModals">
                <bx-input
                  :value="definition.signature.parameters[n - 1].name"
                  @input="
                    definition.signature.parameters[n - 1].name =
                      $event.target.value
                  "
                  placeholder="parameter name"
                  colorScheme="light"
                >
                  <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
                  <span slot="label-text"> Parameter {{ n }} name:</span>
                </bx-input>
              </bx-structured-list-cell>
              <bx-structured-list-cell class="updateModals">
                <bx-input
                  :value="definition.signature.parameters[n - 1].default"
                  @input="
                    definition.signature.parameters[n - 1].default =
                      $event.target.value
                  "
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
                  v-if="componentNumParams > 1"
                  @click="decrementComponent('params', n)"
                >
                  <img class="trash-can-icon" src="@/assets/trash-can.svg" />
                </bx-btn>
              </bx-structured-list-cell>
            </bx-structured-list-row>
          </bx-structured-list-body>
          <bx-btn kind="primary" @click="incrementComponent('params')">
            Add
          </bx-btn>
        </bx-structured-list>
      </bx-accordion-item>
      <bx-accordion-item title-text="Command">
        <bx-input
          :value="definition.command.executable"
          @input="definition.command.executable = $event.target.value"
          placeholder="executable"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text"> Executable:</span>
        </bx-input>
        <br />
        <bx-input
          :value="definition.command.arguments"
          @input="definition.command.arguments = $event.target.value"
          placeholder="arguments"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text"> Arguments:</span>
        </bx-input>
        <br />
        <bx-input
          :value="definition.command.expandArgument"
          @input="definition.command.expandArgument = $event.target.value"
          placeholder="expand argument"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text"> Expand Argument:</span>
        </bx-input>
        <br />
        <bx-input
          :value="definition.command.environment"
          @input="definition.command.environment = $event.target.value"
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
          :value="definition.workflowAttributes.replicate"
          @input="definition.workflowAttributes.replicate = $event.target.value"
          placeholder="replicate"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text"> Replicate:</span>
        </bx-input>
        <br />
        <bx-toggle
          checked
          checked-text="True"
          label-text="Aggregate:"
          unchecked-text="False"
          @bx-toggle-changed="toggleIsAggregateTrue"
        ></bx-toggle>
        <br />
        <bx-input
          :value="definition.workflowAttributes.restartHookFile"
          @input="
            definition.workflowAttributes.restartHookFile = $event.target.value
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
                  componentNumRestart
                }})</bx-structured-list-header-cell
              >
            </bx-structured-list-header-row>
          </bx-structured-list-head>
          <bx-structured-list-body>
            <bx-structured-list-row
              v-for="n in parseInt(componentNumRestart)"
              :key="n"
            >
              <bx-structured-list-cell>
                <bx-input
                  :value="definition.workflowAttributes.restartHookOn[n - 1]"
                  @input="
                    definition.workflowAttributes.restartHookOn[n - 1] =
                      $event.target.value
                  "
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
                  v-if="componentNumRestart > 1"
                  @click="decrementComponent('restart', n)"
                >
                  <img class="trash-can-icon" src="@/assets/trash-can.svg" />
                </bx-btn>
              </bx-structured-list-cell>
            </bx-structured-list-row>
          </bx-structured-list-body>
          <bx-btn kind="primary" @click="incrementComponent('restart')">
            Add
          </bx-btn>
        </bx-structured-list>

        <bx-input
          :value="definition.workflowAttributes.repeatInterval"
          @input="
            definition.workflowAttributes.repeatInterval = $event.target.value
          "
          placeholder="repeat interval"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">Repeat Interval:</span>
        </bx-input>
        <br />
        <bx-input
          :value="definition.workflowAttributes.repeatRetries"
          @input="
            definition.workflowAttributes.repeatRetries = $event.target.value
          "
          placeholder="repeat retries"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">Repeat Retries:</span>
        </bx-input>
        <br />
        <bx-input
          :value="definition.workflowAttributes.maxRestarts"
          @input="
            definition.workflowAttributes.maxRestarts = $event.target.value
          "
          placeholder="max restarts"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">Max Restarts:</span>
        </bx-input>

        <bx-structured-list>
          <bx-structured-list-head>
            <bx-structured-list-header-row>
              <bx-structured-list-header-cell
                >Shutdown Hooks: ({{
                  componentNumShutdown
                }})</bx-structured-list-header-cell
              >
            </bx-structured-list-header-row>
          </bx-structured-list-head>
          <bx-structured-list-body>
            <bx-structured-list-row
              v-for="n in parseInt(componentNumShutdown)"
              :key="n"
            >
              <bx-structured-list-cell>
                <bx-input
                  :value="definition.workflowAttributes.shutdownOn[n - 1]"
                  @input="
                    definition.workflowAttributes.shutdownOn[n - 1] =
                      $event.target.value
                  "
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
                  v-if="componentNumShutdown > 1"
                  @click="decrementComponent('shutdown', n)"
                >
                  <img class="trash-can-icon" src="@/assets/trash-can.svg" />
                </bx-btn>
              </bx-structured-list-cell>
            </bx-structured-list-row>
          </bx-structured-list-body>
          <bx-btn kind="primary" @click="incrementComponent('shutdown')">
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
            :value="definition.config.backend"
            @input="definition.config.backend = $event.target.value"
            placeholder="backend"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Backend:</span>
          </bx-input>
          <br />
          <bx-input
            :value="definition.config.walltime"
            @input="definition.config.walltime = $event.target.value"
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
            :value="definition.lsf.statusRequestInterval"
            @input="definition.lsf.statusRequestInterval = $event.target.value"
            placeholder="status request interval"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Status Request Interval:</span>
          </bx-input>
          <br />
          <bx-input
            :value="definition.lsf.queue"
            @input="definition.lsf.queue = $event.target.value"
            placeholder="queue"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Queue:</span>
          </bx-input>
          <br />
          <bx-input
            :value="definition.lsf.reservation"
            @input="definition.lsf.reservation = $event.target.value"
            placeholder="reservation"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Reservation:</span>
          </bx-input>
          <br />
          <bx-input
            :value="definition.lsf.resourceString"
            @input="definition.lsf.resourceString = $event.target.value"
            placeholder="resource string"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Resource String:</span>
          </bx-input>
          <br />
          <bx-input
            :value="definition.lsf.dockerImage"
            @input="definition.lsf.dockerImage = $event.target.value"
            placeholder="docker image"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Docker Image:</span>
          </bx-input>
          <br />
          <bx-input
            :value="definition.lsf.dockerProfileApp"
            @input="definition.lsf.dockerProfileApp = $event.target.value"
            placeholder="docker profile app"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Docker Profile App:</span>
          </bx-input>
          <br />
          <bx-input
            :value="definition.lsf.dockerOption"
            @input="definition.lsf.dockerOption = $event.target.value"
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
            :value="definition.kubernetes.image"
            @input="definition.kubernetes.image = $event.target.value"
            placeholder="image"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Image:</span>
          </bx-input>
          <br />
          <bx-input
            :value="definition.kubernetes.imagePullSecret"
            @input="definition.kubernetes.imagePullSecret = $event.target.value"
            placeholder="image pull secret"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Image Pull Secret:</span>
          </bx-input>
          <br />
          <bx-input
            :value="definition.kubernetes.gracePeriod"
            @input="definition.kubernetes.gracePeriod = $event.target.value"
            placeholder="grace period"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Grace Period:</span>
          </bx-input>
          <br />
          <bx-input
            :value="definition.kubernetes.podSpec"
            @input="definition.kubernetes.podSpec = $event.target.value"
            placeholder="pod spec"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Pod Spec:</span>
          </bx-input>
          <br />
          <bx-input
            :value="definition.kubernetes.apiKeyVar"
            @input="definition.kubernetes.apiKeyVar = $event.target.value"
            placeholder="api key var"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Api Key Var:</span>
          </bx-input>
          <br />
          <bx-input
            :value="definition.kubernetes.host"
            @input="definition.kubernetes.host = $event.target.value"
            placeholder="host"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Host:</span>
          </bx-input>
          <br />
          <bx-input
            :value="definition.kubernetes.namespace"
            @input="definition.kubernetes.namespace = $event.target.value"
            placeholder="namespace"
            colorScheme="light"
          >
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <span slot="label-text">Namespace:</span>
          </bx-input>
          <br />
          <bx-input
            :value="definition.kubernetes.cpuUnitsPerCore"
            @input="definition.kubernetes.cpuUnitsPerCore = $event.target.value"
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
          :value="definition.resourceRequest.numberProcesses"
          @input="
            definition.resourceRequest.numberProcesses = $event.target.value
          "
          placeholder="number of processes"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">Number of Processes:</span>
        </bx-input>
        <br />
        <bx-input
          :value="definition.resourceRequest.numberThreads"
          @input="
            definition.resourceRequest.numberThreads = $event.target.value
          "
          placeholder="number of threads"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">Number of Threads:</span>
        </bx-input>
        <br />
        <bx-input
          :value="definition.resourceRequest.ranksPerNode"
          @input="definition.resourceRequest.ranksPerNode = $event.target.value"
          placeholder="ranks per node"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">Ranks per Node:</span>
        </bx-input>
        <br />
        <bx-input
          :value="definition.resourceRequest.threadsPerCore"
          @input="
            definition.resourceRequest.threadsPerCore = $event.target.value
          "
          placeholder="threads per core"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">Threads per Core:</span>
        </bx-input>
        <br />
        <bx-input
          :value="definition.resourceRequest.memory"
          @input="definition.resourceRequest.memory = $event.target.value"
          placeholder="memory"
          colorScheme="light"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
          <span slot="label-text">Memory:</span>
        </bx-input>
        <br />
        <bx-input
          :value="definition.resourceRequest.gpus"
          @input="definition.resourceRequest.gpus = $event.target.value"
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

<script setup>
import { watch, ref, reactive } from "vue";
import "@carbon/web-components/es/components/number-input/index.js";
import "@carbon/web-components/es/components/input/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/toggle/index.js";
import "@carbon/web-components/es/components/accordion/index.js";

const emits = defineEmits(["updateDefinition", "removeParent"]);
const props = defineProps({
  nodeDefinition: Object,
  parentNode: Object,
  formEmitted: Boolean,
});

let componentNumReferences = ref(1);
let componentNumParams = ref(1);
let componentNumShutdown = ref(1);
let componentNumRestart = ref(1);
let isAggregateTrue = ref(true);
let parentNodeID = ref("");
let parentNodeLabel = ref("");
let contentSwitcherSelection = ref("config");

let definition = reactive({
  name: "",
  command: {
    executable: "",
    arguments: "",
    expandArgument: "",
    environment: "",
  },
  stage: null,
  variables: "",
  references: [""],
  workflowAttributes: {
    replicate: "",
    aggregate: isAggregateTrue,
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
});
const incrementComponent = (variable) => {
  if (variable == "refs") {
    componentNumReferences.value++;
  } else if (variable == "params") {
    componentNumParams.value++;
    definition.signature.parameters.push({});
  } else if (variable == "restart") {
    componentNumRestart.value++;
  } else if (variable == "shutdown") {
    componentNumShutdown.value++;
  }
};

const decrementComponent = (variable, n) => {
  if (variable == "refs") {
    definition.references.splice(n - 1, 1);
    componentNumReferences.value--;
  } else if (variable == "params") {
    definition.signature.parameters.splice(n - 1, 1);
    componentNumParams.value--;
  } else if (variable == "restart") {
    definition.workflowAttributes.restartHookOn.splice(n - 1, 1);
    componentNumRestart.value--;
  } else if (variable == "shutdown") {
    definition.workflowAttributes.shutdownOn.splice(n - 1, 1);
    componentNumShutdown.value--;
  }
};

const toggleIsAggregateTrue = () => {
  isAggregateTrue.value = !isAggregateTrue.value;
};

// watch(componentNumParams, (newVal) => {
//   for (let i = 1; i < newVal; i++) {
//     definition.signature.parameters.push({ name: "", default: "" });
//   }
// });

watch(
  () => props.nodeDefinition,
  () => {
    definition.name = props.nodeDefinition.name;
    definition.command = props.nodeDefinition.command;
    definition.stage = props.nodeDefinition.stage;
    definition.variables = props.nodeDefinition.variables;
    definition.references = props.nodeDefinition.references;
    componentNumReferences.value = props.nodeDefinition.references.length;
    definition.workflowAttributes = props.nodeDefinition.workflowAttributes;
    componentNumRestart.value =
      props.nodeDefinition.workflowAttributes.restartHookOn.length;
    componentNumShutdown.value =
      props.nodeDefinition.workflowAttributes.shutdownOn.length;
    definition.config = props.nodeDefinition.config;
    definition.lsf = props.nodeDefinition.lsf;
    definition.kubernetes = props.nodeDefinition.kubernetes;
    definition.resourceRequest = props.nodeDefinition.resourceRequest;
    definition.signature = props.nodeDefinition.signature;
    componentNumParams.value = props.nodeDefinition.signature.parameters.length;
    if (props.parentNode != undefined) {
      parentNodeID.value = props.parentNode.id;
      parentNodeLabel.value = props.parentNode.label;
    }
  },
);

watch(
  () => props.formEmitted,
  () => {
    if (props.formEmitted == true) {
      submitComponentValues();
    }
  },
);

const submitComponentValues = () => {
  let emitDefinition = {};
  Object.defineProperties(emitDefinition, {
    name: { value: definition.name, writable: true },
    command: { value: definition.command, writable: true },
    stage: { value: definition.stage, writable: true },
    variables: { value: definition.variables, writable: true },
    references: { value: definition.references, writable: true },
    signature: { value: definition.signature, writable: true },
    workflowAttributes: {
      value: definition.workflowAttributes,
      writable: true,
    },
    resourceRequest: { value: definition.resourceRequest, writable: true },
    config: { value: definition.config, writable: true },
    lsf: { value: definition.lsf, writable: true },
    kubernetes: { value: definition.kubernetes, writable: true },
  });
  emits("updateDefinition", emitDefinition);
};

const removeParentNode = () => {
  emits("removeParent");
};
</script>
<style lang="css" scoped>
@import "@/styles/delete-button-icon-inside-cell-style.css";
@import "@/styles/bx-structured-list-styles.css";
@import "@/styles/bx-accordion-styles.css";
@import "@/styles/bx-modal-styles.css";
</style>
