<template>
  <div>
    <!-- <h5>{{ variable.name }}</h5> -->
    <h5 id="heading">Choose the value for this variable:</h5>
    <cds-radio-button-group
      label-position="right"
      orientation="vertical"
      :name="`radio-group-${variable.name}`"
      :value="selectedValueId"
      @cds-radio-button-group-changed="setVariableValue()"
      style="display: inline;"
    >
      <cds-radio-button
        label-text="Use platform default"
        :value="defaultValueId"
      ></cds-radio-button>
      <cds-radio-button
        label-text="Set preset value"
        :value="presetValueId"
      ></cds-radio-button>
      <cds-text-input
      id="preset-input"
        v-if="
          getVariablePresetValue() != undefined &&
          presetInputsVisible[this.valueIndex] == true
        "
        size="lg"
        class="cds-theme-zone-g10"
        :value="parameterisationOptions.presets.variables[index].value"
        @input="setPresetValue"
        label="Value"
        :invalid="invalidVariables[this.valueIndex]"
        invalidText="Value can not be an empty string"
      />
      <cds-radio-button
        label-text="Set executionOption value"
        :value="executionOptionsValueId"
      ></cds-radio-button>
    </cds-radio-button-group>
    <div v-if="executionOptionInputsVisible[this.valueIndex] == true">
      <div class="cds--row">
        <div class="cds--col-lg-16 space-centre">
          <p>Choose variable options:</p>
          <cds-button kind="ghost" @click="addVariable()"
            >Add Another Option</cds-button
          >
        </div>
      </div>
      <div
        v-if="
          getVariableExecutionOptionsValue() != undefined &&
          'value' in getVariableExecutionOptionsValue()
        "
      >
        <cds-inline-notification
          v-if="getVariableExecutionOptionsValue().value == ''"
          id="no-variable-notification"
          kind="info"
          title="No value set -"
          subtitle="If you don’t add a value, the default value will be set by the platform"
        />
        <div class="cds--row drag">
          <div class="cds--col-lg-14 padding-right">
            <img
              width="16"
              heigth="16"
              src="@/assets/draggable.svg"
              class="drag-input"
            />
            <cds-text-input
              size="lg"
              class="input-size cds-theme-zone-g10"
              :value="getVariableExecutionOptionsValue().value"
              @input="setExecutionOptionValue(i, 'value')"
            />
          </div>
          <div class="cds--col-lg-2 padding-left">
            <cds-button
              id="remove-button"
              kind="danger-ghost"
              title="Remove"
              :disabled="true"
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
            </cds-button>
          </div>
        </div>
      </div>
      <div
        v-if="
          getVariableExecutionOptionsValue() != undefined &&
          'valueFrom' in getVariableExecutionOptionsValue()
        "
      >
        <div
          v-for="(value, i) in getVariableExecutionOptionsValue().valueFrom"
          :key="i"
          @drop="
            onDrop($event, i, getVariableExecutionOptionsValue().valueFrom)
          "
          @dragenter.prevent
          @dragover.prevent
        >
          <div
            class="cds--row drag"
            draggable="true"
            @dragstart="startDrag($event, i)"
          >
            <div class="cds--col-lg-14 padding-right">
              <img
                width="16"
                heigth="16"
                src="@/assets/draggable.svg"
                class="drag-input"
                draggable="false"
              />
              <cds-text-input
                size="lg"
                class="input-size cds-theme-zone-g10"
                :value="value.value"
                @input="setExecutionOptionValue(i, 'valueFrom')"
                :invalid="invalidExecutionOptions[valueIndex][i]"
                invalidText="Value can not be an empty string"
              />
            </div>
            <div class="cds--col-lg-2 padding-left">
              <cds-button
                id="remove-button"
                kind="danger-ghost"
                @click="removeVariable(i)"
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
              </cds-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/notification/index.js";
export default {
  name: "ExperimentView",
  props: {
    parameterisationProp: Object,
    variableProp: Object,
    variableValuesProp: Array,
    valueIndex: Number,
    presetInputsVisibleProp: Array,
    executionOptionInputsVisibleProp: Array,
    invalidVariablesProp: Array,
    invalidExecutionOptionsProp: Array,
  },
  data() {
    return {
      parameterisationOptions: null,
      payloadSet: false,
      presetInputsVisible: false,
      executionOptionsInputsVisible: false,
      defaultValueId: null,
      selectedValueId: null,
      presetValueId: null,
      executionOptionsValueId: null,
      variable: null,
      variableValues: null,
      variableSet: false,
      executionOptionsVariableValue: null,
      index: null,
      invalidVariables: null,
    };
  },
  emits: [
    "fixAccordionStyle",
    "invalidExecutionOption",
    "invalidPresetVariables",
    "newOptions",
    "enableSave",
  ],
  watch: {
    parameterisationProp: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler(val) {
        if (this.payloadSet == false) {
          this.parameterisationOptions = val;
        }
        this.payloadSet = true;
      },
    },
    variableProp: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler(val) {
        if (this.variableSet == false) {
          this.variable = val;
          this.setIndex();
          this.variableValues = this.variableValuesProp;
          this.presetInputsVisible = this.presetInputsVisibleProp;
          this.executionOptionInputsVisible =
            this.executionOptionInputsVisibleProp;
          this.invalidVariables = this.invalidVariablesProp;
          this.invalidExecutionOptions = this.invalidExecutionOptionsProp;
        }
        this.variableSet = true;
        this.setVariableValueIds();
        this.setInitialSelectedValue();
      },
    },
    invalidVariables: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler() {
        this.$emit("invalidPresetVariables", this.invalidVariables);
      },
      deep: true,
    },
    invalidExecutionOptions: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler() {
        this.$emit("invalidExecutionOption", this.invalidExecutionOptions);
      },
      deep: true,
    },
  },
  methods: {
    getVariablePresetValue() {
      let localIdx = this.parameterisationOptions.presets.variables.findIndex(
        (variable) => {
          return variable.name == this.variable.name;
        },
      );
      return this.parameterisationOptions.presets.variables[localIdx];
    },
    getVariableExecutionOptionsValue() {
      let localIdx =
        this.parameterisationOptions.executionOptions.variables.findIndex(
          (variable) => {
            return variable.name == this.variable.name;
          },
        );
      return this.parameterisationOptions.executionOptions.variables[localIdx];
    },
    setIndex() {
      if (this.variable.type == "presets") {
        this.index = this.parameterisationOptions.presets.variables
          .map((variable) => variable.name)
          .indexOf(this.variable.name);
      } else if (this.variable.type == "executionOptions") {
        this.index = this.parameterisationOptions.executionOptions.variables
          .map((variable) => variable.name)
          .indexOf(this.variable.name);
      } else {
        this.index = null;
      }
    },
    setInitialSelectedValue() {
      if (this.variable.type == "presets") {
        this.selectedValueId = this.presetValueId;
        this.presetInputsVisible[this.valueIndex] = true;
      } else if (this.variable.type == "executionOptions") {
        this.selectedValueId = this.executionOptionsValueId;
        this.executionOptionInputsVisible[this.valueIndex] = true;
        if (this.variable.value === undefined) {
          this.variable.value = "";
        }
      } else {
        this.selectedValueId = this.defaultValueId;
      }
    },
    setVariableValue() {
      if (event.detail.value == `${this.variable.name}-default`) {
        this.selectedValueId = this.defaultValueId;
        this.presetInputsVisible[this.valueIndex] = false;
        this.executionOptionInputsVisible[this.valueIndex] = false;
        this.invalidVariables[this.valueIndex] = false;
        this.setDefaultType();
        this.$emit("enableSave");
      } else if (event.detail.value == `${this.variable.name}-preset`) {
        this.$emit("enableSave");
        this.selectedValueId = this.presetValueId;
        this.togglePresetInput();
        this.setPresetType();
        this.checkPresetInputInvalid();
      } else if (
        event.detail.value == `${this.variable.name}-executionOptions`
      ) {
        this.selectedValueId = this.executionOptionsValueId;
        this.invalidVariables[this.valueIndex] = false;
        this.toggleExecutionOptionsInput();
        this.setExecutionOptionType();
        this.$emit("enableSave");
      }
      this.$emit("fixAccordionStyle");
    },
    setVariableValueIds() {
      this.defaultValueId = `${this.variable.name}-default`;
      this.presetValueId = `${this.variable.name}-preset`;
      this.executionOptionsValueId = `${this.variable.name}-executionOptions`;
      this.selectedValueId = this.defaultValueId;
    },
    setDefaultType() {
      this.parameterisationOptions[this.variable.type]["variables"].splice(
        this.index,
        1,
      );
      this.variable.type = "default";
      this.emitNewOptions();
    },
    togglePresetInput() {
      this.executionOptionInputsVisible[this.valueIndex] = false;
      this.presetInputsVisible[this.valueIndex] = true;
    },
    toggleExecutionOptionsInput() {
      this.presetInputsVisible[this.valueIndex] = false;
      this.executionOptionInputsVisible[this.valueIndex] = true;
    },
    setPresetType() {
      if (this.variable.type == "executionOptions") {
        this.index = this.parameterisationOptions.executionOptions.variables
          .map((variable) => variable.name)
          .indexOf(this.variable.name);
        this.parameterisationOptions.executionOptions.variables.splice(
          this.index,
          1,
        );
        // AP: there are instances in which this.valueIndex is
        // greater or equal to the length of VariableValues
        // We just add a new element instead of trying to access
        // an undefined value.
        if (this.valueIndex >= this.variableValues.length) {
          this.parameterisationOptions.presets.variables.push({
            name: this.variable.name,
            value: "",
          });
          this.variableValues[this.valueIndex] = "";
        } else if (this.variableValues[this.valueIndex].constructor === Array) {
          // Execution option with more than 2 values
          this.parameterisationOptions.presets.variables.push({
            name: this.variable.name,
            value:
              this.variableValues[this.valueIndex][0] != undefined
                ? this.variableValues[this.valueIndex][0]
                : "",
          });
          this.variableValues[this.valueIndex] =
            this.variableValues[this.valueIndex][0];
        } else {
          //Execution option with 0 or 1 value
          this.parameterisationOptions.presets.variables.push({
            name: this.variable.name,
            value:
              this.variableValues[this.valueIndex] != undefined
                ? this.variableValues[this.valueIndex]
                : "",
          });
        }
        this.variable.type = "presets";
        this.index = this.parameterisationOptions.presets.variables
          .map((variable) => variable.name)
          .indexOf(this.variable.name);
      } else if (this.variable.type == "default") {
        this.parameterisationOptions.presets.variables.push({
          name: this.variable.name,
          value:
            this.variableValues[this.valueIndex] != undefined
              ? this.variableValues[this.valueIndex]
              : "",
        });
        this.variable.type = "presets";
        this.index = this.parameterisationOptions.presets.variables.length - 1;
      }
      this.emitNewOptions();
    },
    setExecutionOptionType() {
      if (this.variable.type == "presets") {
        this.index = this.parameterisationOptions.presets.variables
          .map((variable) => variable.name)
          .indexOf(this.variable.name);
        // remove variable from presets
        this.parameterisationOptions.presets.variables.splice(this.index, 1);
        // add variable to execution options
        this.parameterisationOptions.executionOptions.variables.push({
          name: this.variable.name,
          value:
            this.variableValues[this.valueIndex] != undefined
              ? this.variableValues[this.valueIndex]
              : "",
        });
        this.variable.type = "executionOptions";
        // set new index
        this.index = this.parameterisationOptions.executionOptions.variables
          .map((variable) => variable.name)
          .indexOf(this.variable.name);
        this.emitNewOptions();
      } else {
        this.parameterisationOptions.executionOptions.variables.push({
          name: this.variable.name,
          value:
            this.variableValues[this.valueIndex] != undefined
              ? this.variableValues[this.valueIndex]
              : "",
        });
        this.variable.type = "executionOptions";
        this.index =
          this.parameterisationOptions.executionOptions.variables.length - 1;
      }
      this.emitNewOptions();
    },
    checkVariablePreset() {
      let preset = this.parameterisationOptions.presets.variables.filter(
        (variable) => variable.name == this.variable.name,
      );
      if (preset.length != 0) {
        return true;
      } else {
        return false;
      }
    },
    setPresetValue() {
      this.index = this.parameterisationOptions.presets.variables
        .map((variable) => variable.name)
        .indexOf(this.variable.name);
      this.parameterisationOptions.presets.variables[this.index].value =
        event.target.value;
      this.variableValues[this.valueIndex] = event.target.value;
      this.checkPresetInputInvalid();
    },
    setExecutionOptionValue(idx, key) {
      this.index = this.parameterisationOptions.executionOptions.variables
        .map((variable) => variable.name)
        .indexOf(this.variable.name);
      if (key == "value") {
        this.parameterisationOptions.executionOptions.variables[this.index][
          key
        ] = event.target.value;
        this.executionOptionsVariableValue = event.target.value;
        this.variableValues[this.valueIndex] = event.target.value;
      } else {
        this.parameterisationOptions.executionOptions.variables[this.index][
          key
        ][idx] = { value: event.target.value };
        this.variableValues[this.valueIndex][idx] = event.target.value;
        this.checkExecutionOptionInvalid(idx);
      }
    },
    removeVariable(index) {
      this.index = this.parameterisationOptions.executionOptions.variables
        .map((variable) => variable.name)
        .indexOf(this.variable.name);
      this.parameterisationOptions.executionOptions.variables[this.index][
        "valueFrom"
      ].splice(index, 1);
      this.invalidExecutionOptions[this.valueIndex].splice(index, 1);
      this.variableValues[this.valueIndex].splice(index, 1);
      if (
        this.parameterisationOptions.executionOptions.variables[this.index][
          "valueFrom"
        ].length == 1
      ) {
        this.renameValueKey("valueFrom", "value");
        this.invalidExecutionOptions[this.valueIndex][0] = false;
      }
    },
    renameValueKey(oldKey, newKey) {
      let value;
      if (newKey == "valueFrom") {
        value = [
          {
            value:
              this.parameterisationOptions.executionOptions.variables[
                this.index
              ].value,
          },
        ];
      } else {
        value =
          this.parameterisationOptions.executionOptions.variables[this.index]
            .valueFrom[0].value;
      }
      this.parameterisationOptions.executionOptions.variables[this.index][
        newKey
      ] = value;
      delete this.parameterisationOptions.executionOptions.variables[
        this.index
      ][oldKey];
    },
    addVariable() {
      this.index = this.parameterisationOptions.executionOptions.variables
        .map((variable) => variable.name)
        .indexOf(this.variable.name);
      if (
        "value" in
        this.parameterisationOptions.executionOptions.variables[this.index]
      ) {
        this.renameValueKey("value", "valueFrom");
        let currentVariableValue = this.variableValues[this.valueIndex];
        this.variableValues[this.valueIndex] = [currentVariableValue, ""];
      }
      this.checkExecutionOptionInvalid(
        this.parameterisationOptions.executionOptions.variables[this.index][
          "valueFrom"
        ].length - 1,
      );
      this.parameterisationOptions.executionOptions.variables[this.index][
        "valueFrom"
      ].push({ value: "" });
      this.invalidExecutionOptions[this.valueIndex].push(true);
      this.variableValues[this.valueIndex].push("");
      this.$emit("fixAccordionStyle");
    },
    emitNewOptions() {
      this.$emit("newOptions", this.parameterisationOptions);
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
    checkPresetInputInvalid() {
      if (
        this.parameterisationOptions.presets.variables[this.index].value == ""
      ) {
        this.invalidVariables[this.valueIndex] = true;
      } else {
        this.invalidVariables[this.valueIndex] = false;
      }
    },
    checkExecutionOptionInvalid(index) {
      if (
        this.parameterisationOptions.executionOptions.variables[this.index]
          .valueFrom[index].value == ""
      ) {
        this.invalidExecutionOptions[this.valueIndex][index] = true;
      } else {
        this.invalidExecutionOptions[this.valueIndex][index] = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
@use "@carbon/layout";
.padding {
  padding-top: layout.$spacing-05;
}
.background {
  background-color: white;
}
.space-centre {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.padding-right {
  padding-right: 0 !important;
}
.padding-left {
  padding-left: 0 !important;
}
#remove-button {
  height: layout.$spacing-09 !important;
  position: relative;
  top: layout.$spacing-05;
}
.input-size {
  display: inline-block;
  width: calc(100% - layout.$spacing-05);
}
#preset-input {
  padding: 0 layout.$spacing-05 layout.$spacing-05;
}
#heading {
  margin: layout.$spacing-05 0;
}
.input {
  display: inline-block;
  width: calc(100% - layout.$spacing-05);
}

.drag-input {
  position: relative;
  top: 2rem;
}

.cds--row {
  flex-wrap: nowrap;
}
</style>
