<template>
  <div v-if="optionsLoading" id="loading-container">
    <bx-loading type="overlay"></bx-loading>
  </div>
  <div v-else>
    <div v-if="parameterisation != null">
      <bx-inline-notification
        id="cancel-notification"
        kind="warning"
        :open="cancelNotificationOpen"
        title="Are you sure?"
        subtitle="All changes that have been made will be lost - click cancel again within 10s to exit"
      >
      </bx-inline-notification>
      <div v-if="tabSelector == 'platforms'" class="tab">
        <div class="cds--row">
          <div class="cds--col-lg-13 cds--col-md-7">
            <h3>Platform</h3>
            <bx-toggle
              @bx-toggle-changed="
                togglePlatform();
                setPlatformType();
              "
              checked-text="Configurable"
              :checked="!singlePlatform"
              label-text="Choose between preset and configurable platforms"
              unchecked-text="Preset"
            />
          </div>
          <div class="cds--col-lg-3 cds--col-md-1">
            <p>Quick Links:</p>
            <bx-link
              v-if="singlePlatform"
              class="link-list"
              href="#single-platform"
              >Platform</bx-link
            >
            <bx-link v-else class="link-list" href="#multi-platform">
              Platform
            </bx-link>
          </div>
        </div>
        <div class="cds--row" v-if="singlePlatform" id="single-platform">
          <div
            class="cds--col-lg-13 cds--col-md-7 margin-horizontal space-centre padding-left"
            id="height"
          >
            <p>Choose preset platform:</p>
          </div>
          <div
            class="cds--col-lg-12 cds--col-md-6 padding-right remove-btn-alignment"
          >
            <br />
            <bx-dropdown
              :value="selectedPlatform"
              @bx-dropdown-selected="setSelectedPlatform()"
              colorScheme="light"
              class="input-size drag-input padding-right"
            >
              <bx-dropdown-item
                v-for="(platform, idx) in platformOptions"
                :key="idx"
                :value="platform"
              >
                {{ platform }}
              </bx-dropdown-item>
            </bx-dropdown>
          </div>
        </div>
        <div v-else id="multi-platform">
          <div class="cds--row">
            <div
              class="cds--col-lg-13 cds--col-md-7 margin-horizontal space-centre padding-left"
            >
              <p>Choose platforms:</p>
              <bx-btn
                kind="ghost"
                @click="addNewPlatform()"
                v-if="availablePlatformOptions.length != 0"
                >Add new platform</bx-btn
              >
            </div>
          </div>
          <bx-modal
            :open="addPlatform"
            @bx-modal-closed="closeAddPlatformModal()"
            v-if="availablePlatformOptions.length > 1"
          >
            <bx-modal-header>
              <bx-modal-close-button></bx-modal-close-button>
              <bx-modal-heading>Choose New Platform</bx-modal-heading>
            </bx-modal-header>
            <bx-modal-body id="platform-modal">
              <bx-radio-button-group
                label-position="right"
                orientation="vertical"
                name="platform"
                @bx-radio-button-group-changed="setPlatformToAdd()"
              >
                <bx-radio-button
                  class="platform-radios"
                  v-for="(platform, idx) in availablePlatformOptions"
                  :key="idx"
                  :value="platform"
                  :label-text="platform"
                  name="platform"
                ></bx-radio-button>
              </bx-radio-button-group>
            </bx-modal-body>
            <bx-modal-footer>
              <bx-modal-footer-button
                kind="secondary"
                @click="closeAddPlatformModal()"
                >Cancel</bx-modal-footer-button
              >
              <bx-modal-footer-button
                kind="primary"
                @click="addSelectedPlatform()"
                >Add</bx-modal-footer-button
              >
            </bx-modal-footer>
          </bx-modal>
          <bx-inline-notification
            v-if="
              parameterisation.executionOptions.platform == undefined ||
              parameterisation.executionOptions.platform.length == 0
            "
            id="no-platform-notification"
            kind="info"
            title="No platform set -"
            subtitle="If you don’t add any option, the default platform will be “default”"
          >
          </bx-inline-notification>
          <div
            v-for="(platform, idx) in parameterisation.executionOptions
              .platform"
            :key="idx"
            @drop="
              onDrop($event, idx, parameterisation.executionOptions.platform)
            "
            @dragenter.prevent
            @dragover.prevent
          >
            <div
              class="cds--row"
              draggable="true"
              @dragstart="startDrag($event, idx)"
            >
              <div
                class="cds--col-lg-12 cds--col-md-6 padding-right remove-btn-alignment"
              >
                <img
                  width="16"
                  heigth="16"
                  src="@/assets/draggable.svg"
                  class="drag-input"
                  draggable="false"
                />
                <bx-input
                  size="lg"
                  class="input-size drag-input padding-right"
                  colorScheme="light"
                  readonly
                  :value="platform"
                  @input="setPlatformName(idx)"
                />
              </div>
              <div class="cds--col-lg-1 cds--col-md-1 margin-horizontal">
                <bx-btn
                  class="remove-btn"
                  kind="danger-ghost"
                  icon-layout
                  size="sm"
                  @click="removePlatform(idx)"
                  title="Remove"
                >
                  <!-- eslint-disable vue/no-deprecated-slot-attribute -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16px"
                    height="16px"
                    viewBox="0 0 32 32"
                    slot="icon"
                  >
                    <rect x="8" y="15" width="16" height="2" />
                  </svg>
                </bx-btn>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="tabSelector == 'variables'" class="tab">
        <div class="cds--row">
          <div class="cds--col-lg-13 cds--col-md-7">
            <h3>Variables</h3>
            <div v-if="variables.length != 0" class="padding">
              <div
                v-for="(variable, idx) in variables"
                :key="idx"
                id="variables"
              >
                <div :id="`${variable.name}`">
                  <bx-accordion>
                    <bx-accordion-item
                      :title-text="variable.name"
                      :open="variableAccordionOpen[idx]"
                    >
                      <EditVariables
                        :parameterisationProp="parameterisation"
                        :variableProp="variable"
                        :variableValuesProp="variableValues"
                        :valueIndex="idx"
                        :presetInputsVisibleProp="presetVariableInputsVisible"
                        :executionOptionInputsVisibleProp="
                          executionOptionInputsVisible
                        "
                        :invalidVariablesProp="invalidVariables"
                        :invalidExecutionOptionsProp="
                          invalidVariableExecutionOptions
                        "
                        @newOptions="setNewParameterisationOptions"
                        @invalidExecutionOption="
                          handleInvalidVariableExcutionOptions
                        "
                        @invalidPresetVariables="handleInvalidPresetVariables"
                      />
                    </bx-accordion-item>
                  </bx-accordion>
                </div>
              </div>
            </div>
            <div class="padding" v-else>No Variables Available</div>
          </div>
          <div class="cds--col-lg-3" v-if="variables.length != 0">
            <p class="link-list">Quick Links:</p>
            <bx-link class="link-list" href="#variables">Variables</bx-link>
            <bx-unordered-list class="link-list">
              <bx-list-item v-for="(variable, idx) in variables" :key="idx">
                <bx-link
                  :href="`#${variable.name}`"
                  @click="openAccordion(idx)"
                >
                  {{ variable.name }}
                </bx-link>
              </bx-list-item>
            </bx-unordered-list>
          </div>
        </div>
      </div>

      <div v-if="tabSelector == 'data'" class="tab">
        <div class="cds--row">
          <div class="cds--col-lg-13 cds--col-md-7">
            <h3>Data</h3>
            <div v-if="dataOptions.length != 0">
              <h4 class="padding">
                Flag the files that should be execution options (the rest will
                be preset)
              </h4>
              <div
                v-for="(file, idx) in dataOptions"
                :key="idx"
                class="execution-options-input"
                id="data"
              >
                <div :id="`${file.name}`">
                  <bx-unordered-list id="data-padding">
                    <bx-list-item>
                      <EditData
                        :parameterisation="parameterisation"
                        :executionOptionsData="dataExecutionOptions"
                        :file="file"
                        :idx="idx"
                        @newDataType="setNewParameterisationOptions"
                      />
                    </bx-list-item>
                  </bx-unordered-list>
                </div>
              </div>
            </div>
            <div v-else><p>No Data Available</p></div>
          </div>
          <div class="cds--col-lg-3" v-if="dataOptions.length != 0">
            <p>Quick Links:</p>
            <bx-link class="link-list" href="#data">Data</bx-link>
            <bx-unordered-list class="link-list">
              <bx-list-item v-for="(file, idx) in dataOptions" :key="idx">
                <bx-link :href="`#${file.name}`">
                  {{ file.name }}
                </bx-link>
              </bx-list-item>
            </bx-unordered-list>
          </div>
        </div>
      </div>
      <div v-if="tabSelector == 'input'" class="tab">
        <div class="cds--row">
          <div class="cds--col-lg-13 cds--col-md-7">
            <h3>Files</h3>
          </div>
          <div class="cds--col-lg-3" v-if="inputs.length != 0">
            <p>Quick Links:</p>
            <bx-link class="link-list" href="#input">Input</bx-link>
          </div>
        </div>
        <div v-if="inputs.length != 0">
          <div
            v-for="(input, idx) in inputs"
            :key="idx"
            id="input"
            class="cds--row"
          >
            <bx-input
              class="cds--col-lg-10 cds--col-md-5"
              colorScheme="light"
              :value="input.name"
              readonly
              disabled
            />
          </div>
        </div>
        <div v-else><p>No Inputs Available</p></div>
      </div>

      <div v-if="tabSelector == 'runtime'" class="tab">
        <div class="cds--row">
          <div class="cds--col-lg-13 cds--col-md-7">
            <h3>Runtime</h3>
          </div>
          <div class="cds--col-lg-3 cds--col-md-1">
            <p>Quick Links:</p>
            <bx-link class="link-list" href="#runtime-args"
              >Runtime Args</bx-link
            >
            <br />
            <br />
            <bx-link class="link-list" href="#orchestrator-resources"
              >Orchestrator Resources</bx-link
            >
          </div>
        </div>
        <div
          class="cds--col-lg-13 cds--col-md-7 margin-horizontal space-centre"
        >
          <h4 id="runtime-args">Runtime Arguments</h4>
          <bx-btn kind="ghost" @click="addRuntimeArg()"
            >Add Another Argument</bx-btn
          >
        </div>
        <div v-if="runtimeArgs.length != 0">
          <div
            v-for="(arg, idx) in runtimeArgs"
            :key="idx"
            class="cds--row remove-btn-alignment"
          >
            <div
              class="cds--col-lg-12 cds--col-md-6 padding-right"
              @drop="onDrop($event, idx, runtimeArgs)"
              @dragenter.prevent
              @dragover.prevent
            >
              <img
                width="16"
                heigth="16"
                src="@/assets/draggable.svg"
                class="drag-input"
                :style="[
                  runtimeArgsInvalid[idx]
                    ? ' position: relative; top: -2rem;'
                    : '',
                ]"
              />
              <bx-input
                size="lg"
                colorScheme="light"
                :value="arg"
                class="input-size drag-input padding-right"
                @input="setRuntimeArg(idx)"
                draggable="true"
                @dragstart="startDrag($event, idx)"
                :invalid="runtimeArgsInvalid[idx]"
                validity-message="Value can not be an empty string"
              />
            </div>
            <div class="cds--col-lg-1 cds--col-md-1 margin-horizontal">
              <bx-btn
                class="remove-btn"
                id="runtime-remove-btn"
                kind="danger-ghost"
                icon-layout
                size="sm"
                @click="removeRuntimeArg(arg, idx)"
                title="Remove"
              >
                <!-- eslint-disable vue/no-deprecated-slot-attribute -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16px"
                  height="16px"
                  viewBox="0 0 32 32"
                  slot="icon"
                >
                  <rect x="8" y="15" width="16" height="2" />
                </svg>
              </bx-btn>
            </div>
          </div>
        </div>
        <div v-else>
          <p>No Runtime Args Set</p>
        </div>
        <br />
        <div
          class="cds--col-lg-13 cds--col-md-6 margin-horizontal space-centre"
        >
          <h4 id="orchestrator-resources">Orchestrator Resources</h4>
          <bx-btn
            v-if="Object.keys(orchestratorResources).length == 0"
            kind="ghost"
            @click="addOrchestratorResources()"
            >Add Orchestrator Resources</bx-btn
          >
          <bx-btn
            v-else
            kind="danger-ghost"
            @click="removeOrchestratorResources()"
            >Remove Orchestrator Resources</bx-btn
          >
        </div>
        <div
          v-if="Object.keys(orchestratorResources).length != 0"
          class="cds--row"
        >
          <div class="cds--col-lg-12 cds--col-md-6">
            <bx-input
              colorScheme="light"
              :value="orchestratorResources.cpu"
              @input="setOrchestratorResourcesValues('cpu')"
              label-text="CPU"
              :invalid="orchestratorResourcesInvalid[0]"
              validity-message="Value can not be an empty string"
            />
            <bx-input
              colorScheme="light"
              :value="orchestratorResources.memory"
              @input="setOrchestratorResourcesValues('memory')"
              label-text="Memory"
              :invalid="orchestratorResourcesInvalid[1]"
              validity-message="Value can not be an empty string"
            />
          </div>
        </div>
        <div v-else>
          <p>No Orchestrator Resources Set</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import EditVariables from "@/components/ParameterisationView/EditComponents/EditVariables.vue";
import EditData from "@/components/ParameterisationView/EditComponents/EditData.vue";

import {
  setRuntimeArgs,
  setVariables,
  setRuntimeArgsInvalid,
  setOrchestratorResources,
  setOrchestratorResourcesInvalid,
} from "@/functions/setup_parameterisation_variables";

import "@carbon/web-components/es/components/toggle/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/list/index.js";
import "@carbon/web-components/es/components/dropdown/index.js";
import "@carbon/web-components/es/components/radio-button/index.js";
import "@carbon/web-components/es/components/notification/index.js";

export default {
  name: "ParameterisationContainer",
  props: {
    id: String,
    tabSelector: String,
    cancelNotificationOpen: Boolean,
    pvep: Object,
    postParameterisationOptions: Boolean,
  },
  components: { EditVariables, EditData },
  data() {
    return {
      parameterisation: null,
      platformOptions: null,
      chosenPlatform: null,
      singlePlatform: true,
      selectedPlatform: null,
      inputs: null,
      addPlatform: false,
      variables: null,
      variableValues: [],
      variableAccordionOpen: [],
      invalidVariables: [],
      presetVariableInputsVisible: [],
      executionOptionInputsVisible: [],
      dataExecutionOptions: null,
      dataOptions: null,
      runtimeArgs: null,
      runtimeArgsInvalid: [],
      orchestratorResources: null,
      orchestratorResourcesInvalid: [],
      addMoreOptions: false,
      entry: null,
      optionsLoading: false,
      invalidVariableExecutionOptions: [],
    };
  },
  computed: {
    availablePlatformOptions: function () {
      if (this.parameterisation.executionOptions.platform == undefined) {
        return this.platformOptions;
      } else {
        return this.platformOptions.filter(
          (option) =>
            !this.parameterisation.executionOptions.platform.includes(option),
        );
      }
    },
  },
  watch: {
    pvep: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler(val) {
        this.entry = val;
        this.parameterisation = val.parameterisation;
        this.platformOptions = val.metadata.registry.platforms;
        if (this.parameterisation.presets.platform != undefined) {
          this.selectedPlatform = this.parameterisation.presets.platform;
        } else {
          this.selectedPlatform =
            this.parameterisation.executionOptions.platform[0];
        }
        this.executionOptionsDefaults =
          val.metadata.registry.executionOptionsDefaults;

        this.dataOptions = val.metadata.registry.data;
        this.dataExecutionOptions = val.parameterisation.executionOptions.data;

        this.inputs = val.metadata.registry.inputs;
        this.parameterisationOptionsLoading = false;
        this.variables = setVariables(val);
        this.variables.forEach((variable) => {
          if ("valueFrom" in variable) {
            this.variableValues.push(
              variable.valueFrom.map((value) => value.value),
            );
          } else if ("value" in variable) {
            this.variableValues.push(variable.value);
          }
        });
        // Loop sets up the boolean arrays for variable input visibility, accordians open and invalidity
        for (let i = 0; i < this.variables.length; i++) {
          this.presetVariableInputsVisible.push(false);
          this.executionOptionInputsVisible.push(false);
          this.variableAccordionOpen.push(false);
          this.invalidVariables.push(false);
          this.invalidVariableExecutionOptions.push([false]);
        }
        this.runtimeArgs = setRuntimeArgs(val);
        this.runtimeArgsInvalid = setRuntimeArgsInvalid(this.runtimeArgs);
        this.orchestratorResources = setOrchestratorResources(val);
        this.orchestratorResourcesInvalid = setOrchestratorResourcesInvalid(
          this.orchestratorResources,
        );
        this.setSinglePlatform();
      },
    },
    postParameterisationOptions: {
      handler(val) {
        if (val == true) {
          this.postNewParameterisation();
        }
      },
    },
    runtimeArgsInvalid: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler() {
        if (this.runtimeArgsInvalid.some((variable) => variable == true)) {
          this.dataInvalid("runtimeArgs");
        } else if (
          this.runtimeArgsInvalid.every((variable) => variable == false)
        ) {
          this.dataValid("runtimeArgs");
        }
      },
      deep: true,
    },
    orchestratorResourcesInvalid: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler() {
        if (
          this.orchestratorResourcesInvalid.some((variable) => variable == true)
        ) {
          this.dataInvalid("orchestratorResources");
        } else if (
          this.orchestratorResourcesInvalid.every(
            (variable) => variable == false,
          )
        ) {
          this.dataValid("orchestratorResources");
        }
      },
      deep: true,
    },
  },
  methods: {
    postNewParameterisation() {
      for (let variable in this.parameterisation.executionOptions.variables) {
        delete this.parameterisation.executionOptions.variables[variable].type;
        if (
          this.parameterisation.executionOptions.variables[variable].value == ""
        ) {
          delete this.parameterisation.executionOptions.variables[variable]
            .value;
        }
      }
      for (let variable in this.parameterisation.presets.variables) {
        delete this.parameterisation.presets.variables[variable].type;
      }
      let newPayload = this.entry;
      newPayload.parameterisation = this.parameterisation;
      this.optionsLoading = true;
      this.$emit("postNewParameterisation");
      axios
        .post(
          window.location.origin +
            `/registry-ui/backend/experiments/${this.id}`,
          newPayload,
        )
        .then((response) => {
          if (response.status == 200) {
            location.reload();
            this.optionsLoading = false;
          }
        })
        .catch((error) => {
          if (error.response.status == 400) {
            alert(`${error.response.data.message}`);
          } else {
            alert(
              "Experiment not found or internal error while creating experiment",
            );
          }
        });
    },
    setSinglePlatform() {
      if (this.parameterisation.presets.platform == undefined) {
        this.singlePlatform = false;
      } else if (this.parameterisation.executionOptions.platform == undefined) {
        this.singlePlatform = true;
      }
    },
    togglePlatform() {
      this.singlePlatform = !this.singlePlatform;
    },
    setPlatformType() {
      if (this.singlePlatform) {
        if (this.parameterisation.executionOptions.platform.length != 0) {
          this.selectedPlatform =
            this.parameterisation.executionOptions.platform[0];
        } else {
          this.selectedPlatform = this.platformOptions[0];
        }
        this.parameterisation.presets.platform = this.selectedPlatform;
        delete this.parameterisation.executionOptions.platform;
      } else {
        delete this.parameterisation.presets.platform;
        this.parameterisation.executionOptions.platform = [
          this.selectedPlatform,
        ];
      }
    },
    setSelectedPlatform() {
      this.parameterisation.presets.platform = event.detail.item.value;
      this.selectedPlatform = event.detail.item.value;
    },
    setPlatformName(idx) {
      this.parameterisation.executionOptions.platform[idx] = event.target.value;
    },
    removePlatform(index) {
      this.parameterisation.executionOptions.platform.splice(index, 1);
      if (this.parameterisation.executionOptions.platform.length == 0) {
        delete this.parameterisation.executionOptions.platform;
      }
    },
    addNewPlatform() {
      if (this.parameterisation.executionOptions.platform == undefined) {
        this.parameterisation.executionOptions.platform = [];
      }
      if (this.availablePlatformOptions.length > 1) {
        this.addPlatform = true;
        this.uncheckRadioButtons();
      } else if (this.availablePlatformOptions.length == 1) {
        this.parameterisation.executionOptions.platform.push(
          this.availablePlatformOptions[0],
        );
      }
    },
    uncheckRadioButtons() {
      let radioButtons = Array.from(
        document.getElementsByClassName("platform-radios"),
      );
      radioButtons.forEach((button) => button.removeAttribute("checked"));
    },
    setPlatformToAdd() {
      this.chosenPlatform = event.detail.value;
    },
    addSelectedPlatform() {
      if (this.chosenPlatform != null) {
        this.parameterisation.executionOptions.platform.push(
          this.chosenPlatform,
        );
        this.chosenPlatform = null;
        this.closeAddPlatformModal();
      } else {
        alert("Select an option");
      }
    },
    closeAddPlatformModal() {
      this.addPlatform = false;
    },
    openAccordion(index) {
      this.variableAccordionOpen[index] = true;
    },
    addOrchestratorResources() {
      this.orchestratorResources = { cpu: "", memory: "" };
      this.parameterisation.executionOptions.runtime.resources = {
        cpu: "",
        memory: "",
      };
      this.orchestratorResourcesInvalid[0] = true;
      this.orchestratorResourcesInvalid[1] = true;
    },
    removeOrchestratorResources() {
      this.orchestratorResources = {};
      if (
        this.parameterisation.executionOptions.runtime.resources != undefined
      ) {
        this.parameterisation.executionOptions.runtime.resources = {};
      }
      if (this.parameterisation.presets.runtime.resources != undefined) {
        this.parameterisation.presets.runtime.resources = {};
      }
      this.orchestratorResourcesInvalid[0] = false;
      this.orchestratorResourcesInvalid[1] = false;
    },
    setRuntimeArg(idx) {
      this.runtimeArgs[idx] = event.target.value;
      this.parameterisation.executionOptions.runtime.args[idx] =
        event.target.value;
      if (this.parameterisation.executionOptions.runtime.args[idx] == "") {
        this.runtimeArgsInvalid[idx] = true;
      } else {
        this.runtimeArgsInvalid[idx] = false;
      }
    },
    setOrchestratorResourcesValues(type) {
      this.orchestratorResources[type] = event.target.value;
      this.parameterisation.executionOptions.runtime.resources[type] =
        event.target.value;
      if (this.orchestratorResources[type] == "" && type == "cpu") {
        this.orchestratorResourcesInvalid[0] = true;
      } else if (type == "cpu") {
        this.orchestratorResourcesInvalid[0] = false;
      }
      if (this.orchestratorResources[type] == "" && type == "memory") {
        this.orchestratorResourcesInvalid[1] = true;
      } else if (type == "memory") {
        this.orchestratorResourcesInvalid[1] = false;
      }
    },
    removeRuntimeArg(arg, index) {
      if (this.parameterisation.presets.runtime.args.includes(arg)) {
        this.parameterisation.presets.runtime.args.splice(
          this.parameterisation.presets.runtime.args.indexOf(arg),
          1,
        );
      } else if (
        this.parameterisation.executionOptions.runtime.args.includes(arg)
      ) {
        this.parameterisation.executionOptions.runtime.args.splice(
          this.parameterisation.executionOptions.runtime.args.indexOf(arg),
          1,
        );
      }
      this.runtimeArgs.splice(index, 1);
      this.runtimeArgsInvalid.splice(index, 1);
    },
    addRuntimeArg() {
      this.parameterisation.executionOptions.runtime.args.push("");
      this.runtimeArgs.push("");
      this.runtimeArgsInvalid.push(true);
    },

    setNewParameterisationOptions(newOptions) {
      this.parameterisation = newOptions;
    },
    toggleAddMoreOptions() {
      this.addMoreOptions = !this.addMoreOptions;
    },
    startDrag(event, index) {
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("initialIndex", index);
    },
    onDrop(event, newIndex, array) {
      let oldIndex = event.dataTransfer.getData("initialIndex");
      let element = array.splice(oldIndex, 1)[0];
      array.splice(newIndex, 0, element);
    },
    dataInvalid(key) {
      this.$emit("dataInvalid", key);
    },
    dataValid(key) {
      this.$emit("dataValid", key);
    },
    handleInvalidVariableExcutionOptions(invalidVariableExecutionOptions) {
      let variableContainsInvalid = [];
      invalidVariableExecutionOptions.forEach((variable) =>
        variableContainsInvalid.push(variable.some((value) => value == true)),
      );
      if (variableContainsInvalid.every((value) => value == false)) {
        this.dataValid("variableExecutionOptions");
      } else {
        this.dataInvalid("variableExecutionOptions");
      }
    },
    handleInvalidPresetVariables(invalidPresetVariables) {
      if (invalidPresetVariables.every((variable) => variable == false)) {
        this.dataValid("variableExecutionOptions");
      } else {
        this.dataInvalid("variableExecutionOptions");
      }
    },
  },
};
</script>

<style scoped lang="scss">
@use "@carbon/layout";
.tab {
  padding: layout.$spacing-05;
}
.padding {
  padding-top: layout.$spacing-05;
}
.remove-btn-alignment {
  position: relative;
  top: -(layout.$spacing-05);
}
.padding-right {
  padding-right: 0 !important;
}
.margin-horizontal {
  padding-left: 0 !important;
  margin-right: layout.$spacing-07;
}
.input-size {
  display: inline-block;
  width: calc(100% - layout.$spacing-05);
}
.background {
  background-color: white;
}
#data-padding {
  padding-top: layout.$spacing-03;
}
.link-list {
  position: relative;
  z-index: 10000;
  max-width: layout.$spacing-13;
}
.space-centre {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.drag-input:active {
  cursor: grabbing !important;
}
.remove-btn {
  position: relative;
  height: layout.$spacing-09 !important;
  width: layout.$spacing-09 !important;
}
#runtime-remove-btn {
  top: layout.$spacing-05;
}
#loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
#height {
  height: layout.$spacing-09;
}
.padding-left {
  padding-left: layout.$spacing-05 !important;
}

#platform-modal {
  min-height: layout.$spacing-13;
}

#cancel-notification {
  min-width: 30rem;
  margin-bottom: 0.5rem;
}
</style>
