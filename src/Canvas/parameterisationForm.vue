<template>
  <div v-if="parameterisationOptionsLoading" id="experimentLoadingContainer">
    <bx-loading type="overlay"></bx-loading>
  </div>

  <div v-else>
    <bx-tabs trigger-content="Select an item" value="presets">
      <bx-tab id="tab-presets" target="panel-presets" value="presets"
        >Presets</bx-tab
      >
      <bx-tab
        id="tab-executionOptions"
        target="panel-executionOptions"
        value="executionOptions"
        >Execution Options</bx-tab
      >
    </bx-tabs>
    <div class="bx-ce-demo-devenv--tab-panels">
      <div
        id="panel-presets"
        role="tabpanel"
        aria-labelledby="tab-presets"
        hidden
      >
        <bx-accordion>
          <bx-accordion-item title-text="Variables">
            <h3>Variables</h3>
            <div v-if="parameterisation.presets != undefined">
              <div v-if="parameterisation.presets.variables.length != 0">
                <bx-dropdown
                  trigger-content="Select a variable name"
                  color-scheme="light"
                  @bx-dropdown-selected="handleVariableNameDropdownSelect"
                >
                  <div
                    v-for="(option, idx) in parameterisation.presets.variables"
                    v-bind:key="idx"
                  >
                    <bx-dropdown-item :value="option.name">{{
                      option.name
                    }}</bx-dropdown-item>
                  </div>
                </bx-dropdown>

                <div v-if="presetVariable.value != ''" class="input-wrapper">
                  <bx-input
                    label-text="Value"
                    :value="presetVariable.value"
                    @input="setParameterisationPresetVariableValue"
                    colorScheme="light"
                  >
                  </bx-input>
                </div>
              </div>
            </div>
          </bx-accordion-item>
          <!--
                  <div class="inputs">
                    <div class="input-wrapper">
                      <bx-input
                        name="parameter"
                        v-model="option.name"
                        colorScheme="light"
                        label-text="Name"
                      >
                      </bx-input>
                    </div>
                    <div class="input-wrapper">
                      <bx-input
                        name="parameter"
                        v-model="option.value"
                        colorScheme="light"
                        label-text="Value"
                      >
                      </bx-input>
                      <button
                        class="remove-button"
                        @click="removeFromArray('presets.variables', idx)"
                      >
                        X
                      </button>
                    </div>
                  </div>
                </div> -->

          <!-- <h4>Add variables:</h4>
            <div class="inputs">
              <div class="input-wrapper">
                <bx-input
                  label-text="Name"
                  colorScheme="light"
                  :value="presetVariable.name"
                  @input="presetVariable.name = $event.target.value;
                  checkIfInvalidVariable('presets')"
                  :invalid='presetsVaraibleInvalid'
                  validity-message="Error: cannot define duplicate variables"
                >
                </bx-input>
              </div>
              

                <button
                  class="add-button"
                  @click="
                    addToArray('presets.variables', {
                      ...presetVariable,
                    })
                  "
                >
                  Add
                </button>
              </div>
            </div> -->

          <!-- Hidden in line with Vassilis comments on presets configuration -->

          <!-- <bx-accordion-item title-text="Data">
            <h3>Data</h3>
            <div v-if="parameterisation.presets != undefined">
              <div v-if="parameterisation.presets.data != undefined">
                <div
                  v-for="(option, idx) in parameterisation.presets.data"
                  v-bind:key="idx"
                >
                  <div class="inputs">
                    <div class="input-wrapper">
                      <bx-input
                        v-model="option.name"
                        colorScheme="light"
                        label-text="Name"
                      >
                      </bx-input>
                    </div>

                    <button
                      class="remove-button"
                      @click="removeFromArray('presets.data', idx)"
                    >
                      X
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <h4>Add Data:</h4>
            <div class="inputs">
              <div class="input-wrapper">
                <bx-input
                  id="presetsDataInput"
                  v-model="presetData.name"
                  colorScheme="light"
                  label-text="Name"
                >
                </bx-input>
              </div>

              <button
                class="add-button"
                @click="
                  addToArray('presets.data', {
                    ...presetData,
                  })
                "
              >
                Add
              </button>
            </div>
          </bx-accordion-item> -->
          <bx-accordion-item title-text="Runtime">
            <h3>Args</h3>
            <div class="inputs">
              <div class="input-wrapper">
                <div v-if="parameterisation.presets != undefined">
                  <div v-if="parameterisation.presets.runtime != undefined">
                    <div
                      v-if="parameterisation.presets.runtime.args.length != 0"
                    >
                      <div
                        v-for="(option, idx) in parameterisation.presets.runtime
                          .args"
                        v-bind:key="idx"
                        color-scheme="light"
                      >
                        <bx-input
                          label-text="Arg"
                          :value="parameterisation.presets.runtime.args[idx]"
                          @input="
                            parameterisation.presets.runtime.args[idx] =
                              $event.target.value
                          "
                          color-scheme="light"
                        >
                        </bx-input>
                        <button
                          class="remove-button"
                          @click="removeFromArray('presets.runtime.args', idx)"
                        >
                          X
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />

            <h3>Add Args:</h3>
            <div class="inputs">
              <div class="input-wrapper">
                <bx-input
                  id="presetsDataInput"
                  :value="presetRuntimeArg"
                  @input="presetRuntimeArg = $event.target.value"
                  colorScheme="light"
                  label-text="Arg"
                >
                </bx-input>
              </div>
              <button
                class="add-button"
                @click="addToArray('presets.runtime.args', presetRuntimeArg)"
              >
                Add
              </button>
            </div>

            <div class="inputs">
              <div class="input-wrapper">
                <bx-input
                  colorScheme="light"
                  label-text="Cpu"
                  :value="parameterisation.presets.runtime.resources.cpu"
                  @input="handleResouceInput('cpu')"
                >
                </bx-input>
              </div>
              <div class="input-wrapper">
                <bx-input
                  colorScheme="light"
                  label-text="Memory"
                  :value="parameterisation.presets.runtime.resources.memory"
                  @input="handleResouceInput('memory')"
                >
                </bx-input>
              </div>
            </div>
          </bx-accordion-item>
          <bx-accordion-item title-text="Environmental Variables">
            <h3>Environmental Variables</h3>
            <div v-if="parameterisation.presets != undefined">
              <div
                v-if="
                  parameterisation.presets.environmentVariables != undefined
                "
              >
                <div
                  v-for="(option, idx) in parameterisation.presets
                    .environmentVariables"
                  v-bind:key="idx"
                >
                  <div class="inputs">
                    <div class="input-wrapper">
                      <bx-input
                        :value="option.name"
                        @input="option.name = $event.target.value"
                        colorScheme="light"
                        label-text="Name"
                      >
                      </bx-input>
                    </div>
                    <div class="input-wrapper">
                      <bx-input
                        label-text="Value"
                        :value="option.value"
                        @input="option.value = $event.target.value"
                        colorScheme="light"
                      >
                      </bx-input>
                      <button
                        class="remove-button"
                        @click="
                          removeFromArray('presets.environmentVariables', idx)
                        "
                      >
                        X
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h4>Add Environmental Variables:</h4>
            <div class="inputs">
              <div class="input-wrapper">
                <bx-input
                  id="presetsDataInput"
                  :value="presetEnvironmentVariables.name"
                  @input="presetEnvironmentVariables.name = $event.target.value"
                  colorScheme="light"
                  label-text="Name"
                >
                </bx-input>
              </div>
              <div class="input-wrapper">
                <bx-input
                  label-text="Value"
                  :value="presetEnvironmentVariables.value"
                  @input="
                    presetEnvironmentVariables.value = $event.target.value
                  "
                  colorScheme="light"
                >
                </bx-input>

                <button
                  class="add-button"
                  @click="
                    addToArray('presets.environmentVariables', {
                      ...presetEnvironmentVariables,
                    })
                  "
                >
                  Add
                </button>
              </div>
            </div>
          </bx-accordion-item>
          <bx-accordion-item title-text="Platform">
            <h3>Platform</h3>
            <h4>Add platform:</h4>
            <div class="inputs">
              <div class="input-wrapper">
                <bx-input
                  colorScheme="light"
                  :value="presetPlatform"
                  :invalid="presetsPlatformInvalid"
                  @input="
                    presetPlatform = $event.target.value;
                    addPlatformStringToPayload();
                    checkPlatformsMutuallyExclusive();
                  "
                  id="presetsPlatform"
                  label-text="Name"
                  validity-message="Error: platform cannot be set in presets and execution
                    options"
                >
                </bx-input>
              </div>
            </div>
          </bx-accordion-item>
        </bx-accordion>
      </div>
      <div
        id="panel-executionOptions"
        role="tabpanel"
        aria-labelledby="tab-executionOptions"
        hidden
      >
        <bx-accordion>
          <bx-accordion-item title-text="Variables">
            <h3>Variables</h3>
            <div v-if="parameterisation.executionOptions != undefined">
              <div
                v-if="parameterisation.executionOptions.variables.length != 0"
              >
                <div
                  v-for="(option, idx) in parameterisation.executionOptions
                    .variables"
                  v-bind:key="idx"
                >
                  <div class="input-wrapper">
                    <bx-input
                      :value="option.name"
                      @input="option.name = $event.target.value"
                      colorScheme="light"
                      label-text="Name"
                    >
                    </bx-input>
                  </div>
                  <div class="input-wrapper">
                    <bx-input
                      :value="option.value"
                      @input="option.value = $event.target.value"
                      colorScheme="light"
                      label-text="Value"
                    >
                    </bx-input>
                    <button
                      class="remove-button"
                      @click="
                        removeFromArray('executionOptions.variables', idx)
                      "
                    >
                      X
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <h4>Add variables:</h4>
            <div class="inputs">
              <div class="input-wrapper">
                <bx-input
                  label-text="Name"
                  colorScheme="light"
                  :value="executionOptionsVariable.name"
                  @input="
                    executionOptionsVariable.name = $event.target.value;
                    checkIfInvalidVariable();
                  "
                  :invalid="executionOptionsVariableInvalid"
                  validity-message="Error: cannot define duplicate variables"
                >
                </bx-input>
              </div>
              <div class="input-wrapper">
                <bx-input
                  :value="executionOptionsVariable.value"
                  @input="executionOptionsVariable.value = $event.target.value"
                  colorScheme="light"
                  label-text="Value"
                >
                </bx-input>
                <button
                  class="add-button"
                  @click="
                    addToArray('executionOptions.variables', {
                      ...executionOptionsVariable,
                    })
                  "
                >
                  Add
                </button>
              </div>
            </div>
          </bx-accordion-item>

          <bx-accordion-item title-text="Data">
            <h3>Data</h3>
            <div v-if="parameterisation.executionOptions != undefined">
              <div v-if="parameterisation.executionOptions.data.length != 0">
                <div
                  v-for="(option, idx) in parameterisation.executionOptions
                    .data"
                  v-bind:key="idx"
                >
                  <div class="inputs">
                    <div class="input-wrapper">
                      <bx-input
                        colorScheme="light"
                        :value="
                          parameterisation.executionOptions.data[idx].name
                        "
                        @input="
                          parameterisation.executionOptions.data[idx].name =
                            $event.target.value
                        "
                        label-text="Name"
                      >
                      </bx-input>
                      <button
                        class="remove-button"
                        @click="removeFromArray('executionOptions.data', idx)"
                      >
                        X
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h4>Add data:</h4>
            <div class="input-wrapper">
              <bx-input
                :value="executionOptionsData.name"
                @input="executionOptionsData.name = $event.target.value"
                colorScheme="light"
                label-text="Name"
              >
              </bx-input>
              <button
                class="add-button"
                @click="
                  addToArray('executionOptions.data', {
                    ...executionOptionsData,
                  })
                "
              >
                Add
              </button>
            </div>
          </bx-accordion-item>
          <bx-accordion-item title-text="Runtime">
            <div class="inputs">
              <div class="input-wrapper">
                <div v-if="parameterisation.executionOptions != undefined">
                  <div v-if="parameterisation.presets.runtime != undefined">
                    <div
                      v-if="
                        parameterisation.executionOptions.runtime.args.length !=
                        0
                      "
                    >
                      <h3>Args</h3>
                      <div
                        v-for="(option, idx) in parameterisation
                          .executionOptions.runtime.args"
                        v-bind:key="idx"
                      >
                        <bx-input
                          label-text="Arg"
                          :value="
                            parameterisation.executionOptions.runtime.args[idx]
                          "
                          @input="
                            parameterisation.executionOptions.runtime.args[
                              idx
                            ] = $event.target.value
                          "
                          color-scheme="light"
                        >
                        </bx-input>
                        <button
                          class="remove-button"
                          @click="
                            removeFromArray(
                              'executionOptions.runtime.args',
                              idx,
                            )
                          "
                        >
                          X
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />

            <h3>Add Args:</h3>
            <div class="inputs">
              <div class="input-wrapper">
                <bx-input
                  id="presetsDataInput"
                  :value="executionOptionsRuntimeArg"
                  @input="executionOptionsRuntimeArg = $event.target.value"
                  colorScheme="light"
                  label-text="Arg"
                >
                </bx-input>
              </div>
              <button
                class="add-button"
                @click="
                  addToArray(
                    'executionOptions.runtime.args',
                    executionOptionsRuntimeArg,
                  )
                "
              >
                Add
              </button>
            </div>
          </bx-accordion-item>
          <bx-accordion-item title-text="Platform">
            <h3>Platform</h3>
            <div v-if="parameterisation.executionOptions != undefined">
              <div
                v-if="parameterisation.executionOptions.platform.length != 0"
              >
                <div
                  v-for="(option, idx) in parameterisation.executionOptions
                    .platform"
                  v-bind:key="idx"
                >
                  <div class="inputs">
                    <div class="input-wrapper">
                      <bx-input
                        :value="parameterisation.executionOptions.platform[idx]"
                        @input="
                          parameterisation.executionOptions.platform[idx] =
                            $event.target.value
                        "
                        colorScheme="light"
                        label-text="Name"
                        :invalid="executionOptionsPlatformInvalid"
                        validity-message="Error: platform cannot be set in presets and execution options"
                      >
                      </bx-input>
                      <button
                        class="remove-button"
                        @click="
                          removeFromArray('executionOptions.platform', idx)
                        "
                      >
                        X
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h4>Add platform:</h4>
            <div class="input-wrapper">
              <bx-input
                label-text="Name"
                colorScheme="light"
                :value="executionOptionsPlatform"
                @input="
                  executionOptionsPlatform = $event.target.value;
                  checkPlatformsMutuallyExclusive();
                "
                :invalid="executionOptionsPlatformInvalid"
                validity-message="Error: platform cannot be set in presets and execution options"
              >
              </bx-input>

              <button
                class="add-button"
                @click="
                  addToArray(
                    'executionOptions.platform',
                    executionOptionsPlatform,
                  )
                "
              >
                Add
              </button>
            </div>
          </bx-accordion-item>
        </bx-accordion>
      </div>
    </div>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/input/index.js";
import "@carbon/web-components/es/components/tabs/index.js";
import "@carbon/web-components/es/components/accordion/index.js";
import "@carbon/web-components/es/components/dropdown/index.js";
import axios from "axios";

export default {
  name: "parameterisationForm",
  props: {
    id: {
      type: String,
      default: "",
    },
    formEmit: {
      type: Boolean,
    },
    parameterisationLoading: {
      type: Boolean,
    },
  },
  watch: {
    formEmit(newValue) {
      if (newValue == true) {
        this.emitParameterisationOptionsPayload();
      }
    },
    parameterisationLoading() {
      this.parameterisationOptionsLoading = true;
    },
  },
  emits: ["postParameterisationOptions"],
  data() {
    return {
      parameterisationPayload: {},
      parameterisation: {},
      presetVariable: { name: "", value: "" },
      presetVariableIndex: null,
      presetData: { name: "" },
      presetRuntimeOrchestratorResources: { cpu: "", memory: "" },
      orchestratorResourcesKeyAdded: false,
      presetRuntimeArg: "",
      presetEnvironmentVariables: { name: "", value: "" },
      presetPlatform: "",
      executionOptionsVariable: { name: "", value: "" },
      executionOptionsData: { name: "" },
      executionOptionsRuntimeArg: "",
      executionOptionsPlatform: "",
      parameterisationOptionsLoading: true,
      presetsPlatformInvalid: false,
      executionOptionsPlatformInvalid: false,
      presetsVaraibleInvalid: false,
      executionOptionsVariableInvalid: false,
    };
  },
  methods: {
    getParameterisationOptions() {
      axios
        .get(
          window.location.origin +
            "/registry-ui/backend/experiments/" +
            this.id +
            "/parameterisation",
        )
        .then((response) => {
          this.parameterisationPayload = response.data.entry;
          this.parameterisation = response.data.entry.parameterisation;
          this.parameterisationOptionsLoading = false;
        });
    },
    addToArray(keys, value) {
      let keyArr = keys.split(".");
      if (keyArr.length == 2) {
        this.parameterisation[keyArr[0]][keyArr[1]].push(value);
      } else if (keyArr.length == 3) {
        this.parameterisation[keyArr[0]][keyArr[1]][keyArr[2]].push(value);
      }
      this.resetArrayInputs(keys);
    },
    removeFromArray(keys, idx) {
      let keyArr = keys.split(".");
      if (keyArr.length == 2) {
        this.parameterisation[keyArr[0]][keyArr[1]].splice(idx, 1);
      }
      if (keyArr.length == 3) {
        this.parameterisation[keyArr[0]][keyArr[1]][keyArr[2]].splice(idx, 1);
      }
    },
    addPlatformStringToPayload() {
      this.parameterisation.presets.platform = this.presetPlatform;
    },
    resetArrayInputs(key) {
      if (key == "presets.variables") {
        this.presetVariable = { name: "", value: "" };
      }
      if (key == "presets.data") {
        this.presetData = { name: "" };
      }
      if (key == "presets.environmentVariables") {
        this.presetEnvironmentVariables = { name: "", value: "" };
      }
      if (key == "presets.runtime.args") {
        this.presetRuntimeArg = "";
      }
      if (key == "executionOptions.variables") {
        this.executionOptionsVariable = { name: "", value: "" };
      }
      if (key == "executionOptions.data") {
        this.executionOptionsData = { name: "" };
      }
      if (key == "executionOptions.runtime.args") {
        this.executionOptionsRuntimeArg = "";
      }
      if (key == "executionOptions.platform") {
        this.executionOptionsPlatform = "";
      }
    },
    checkPlatformsMutuallyExclusive() {
      if (
        this.parameterisation.presets.platform.length != 0 &&
        this.parameterisation.executionOptions.platform.length != 0
      ) {
        this.presetsPlatformInvalid = true;
        this.executionOptionsPlatformInvalid = true;
      } else {
        this.presetsPlatformInvalid = false;
        this.executionOptionsPlatformInvalid = false;
      }
    },
    checkIfInvalidVariable(key) {
      let matchingVariables = this.checkIfDuplicateVariableNames(key);
      this.handleInvalidFormInput(matchingVariables, key);
    },
    checkIfDuplicateVariableNames(key) {
      let duplicateAcrossForms;
      if (key == "presets") {
        duplicateAcrossForms =
          this.parameterisation.executionOptions.variables.filter(
            (element) => this.presetVariable.name === element.name,
          );
      } else {
        duplicateAcrossForms = this.parameterisation.presets.variables.filter(
          (element) => this.executionOptionsVariable.name === element.name,
        );
      }

      let duplicateInPresets = this.parameterisation.presets.variables.filter(
        (element) => this.presetVariable.name === element.name,
      );
      let duplicateInExecutionOptions =
        this.parameterisation.executionOptions.variables.filter(
          (element) => this.executionOptionsVariable.name === element.name,
        );

      let matchingVariables = duplicateAcrossForms.concat(
        duplicateInPresets,
        duplicateInExecutionOptions,
      );

      return matchingVariables;
    },
    handleInvalidFormInput(matchingVariables, key) {
      if (matchingVariables.length != 0) {
        if (key == "presets") {
          this.presetsVaraibleInvalid = true;
        } else {
          this.executionOptionsVariableInvalid = true;
        }
      } else {
        if (key == "presets") {
          this.presetsVaraibleInvalid = false;
        } else {
          this.executionOptionsVariableInvalid = false;
        }
      }
    },
    emitParameterisationOptionsPayload() {
      this.$emit("postParameterisationOptions", this.parameterisationPayload);
    },
    handleResouceInput(key) {
      this.parameterisation.presets.runtime.resources[key] = event.target.value;
    },
    handleVariableNameDropdownSelect() {
      for (let i = 0; i < this.parameterisation.presets.variables.length; i++) {
        if (
          this.parameterisation.presets.variables[i].name == event.target.value
        ) {
          this.presetVariableIndex = i;
          this.presetVariable.value =
            this.parameterisation.presets.variables[i].value;
          return;
        }
      }
    },
    setParameterisationPresetVariableValue() {
      this.presetVariable.value = event.target.value;
      this.parameterisation.presets.variables[this.presetVariableIndex].value =
        this.presetVariable.value;
    },
  },
  mounted() {
    this.getParameterisationOptions();
  },
};
</script>
