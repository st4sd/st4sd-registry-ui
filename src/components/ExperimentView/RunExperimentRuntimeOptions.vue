<template>
  <h4>Runtime Options</h4>
  <div class="cds--subgrid cds--subgrid--condensed">
    <p class="cds--css-grid-column cds--col-span-50">
      <strong>Additonal Runtime Arguments</strong>
    </p>
    <cds-button
      class="cds--css-grid-column cds--xlg:col-start-14 cds--lg:col-start-14 cds--md:col-start-6 cds--col-span-3"
      kind="ghost"
      @click="addItem(true, 'additionalRuntimeArgs')"
      >Add Argument</cds-button
    >
  </div>

  <div v-if="additionalRuntimeArgs.length != 0">
    <br />
    <div
      v-for="(arg, idx) in additionalRuntimeArgs"
      :key="idx"
      @drop="onDrop($event, idx, additionalRuntimeArgs)"
      @dragenter.prevent
      @dragover.prevent
    >
      <div
        class="cds--css-grid cds--css-grid--narrow drag"
        draggable="true"
        @dragstart="startDrag($event, idx)"
      >
        <div
          class="cds--css-grid-column cds--lg:col-span-14 cds--md:col-span-6 draggable-text-box"
        >
          <div style="height: 48px; display: flex">
            <img
              style="align-self: auto"
              width="16"
              heigth="16"
              src="@/assets/draggable.svg"
              draggable="false"
            />
          </div>
          <cds-text-input
            size="lg"
            :value="arg"
            class="input-size cds-theme-zone-g10"
            @input="setItem($event, true, 'additionalRuntimeArgs', idx)"
            :invalid="arg.trim() == ''"
            invalidText="Value can not be an empty string"
          />
        </div>
        <div
          :class="`cds--css-grid-column cds--sm:col-span-2 ${arg.trim() == '' ? 'align-content-center' : 'align-content-end'}`"
        >
          <cds-button
            kind="danger-ghost"
            @click="removeItem('additionalRuntimeArgs', idx)"
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
        <br />
      </div>
    </div>
    <br />
  </div>
  <div v-else>
    <p>No Additional Runtime Args Set</p>
  </div>
  <div class="cds--subgrid cds--subgrid--condensed">
    <p class="cds--css-grid-column cds--col-span-50">
      <strong>Environment Variables</strong>
    </p>
    <cds-button
      class="cds--css-grid-column cds--xlg:col-start-14 cds--lg:col-start-14 cds--md:col-start-6 cds--col-span-3"
      kind="ghost"
      @click="addItem(false, 'environmentVariables')"
      >Add Variable</cds-button
    >
  </div>
  <div
    v-if="environmentVariables.length != 0"
    v-for="(variable, idx) in environmentVariables"
    :key="idx"
  >
    <div class="cds--css-grid cds--css-grid--narrow">
      <div class="cds--css-grid-column cds--lg:col-span-7 cds--md:col-span-3">
        <cds-text-input
          label="Name"
          size="lg"
          :value="variable.name"
          class="cds-theme-zone-g10"
          @input="setItem($event, false, 'environmentVariables', idx, 'name')"
          :invalid="variable.name.trim() == ''"
          invalidText="Name can not be an empty string"
        />
      </div>
      <div class="cds--css-grid-column cds--lg:col-span-7 cds--md:col-span-3">
        <cds-text-input
          label="Value"
          size="lg"
          :value="variable.value"
          class="cds-theme-zone-g10"
          @input="setItem($event, false, 'environmentVariables', idx, 'value')"
          :invalid="variable.value.trim() == ''"
          invalidText="Value can not be an empty string"
        />
      </div>
      <div
        :class="`cds--css-grid-column ${variable.value.trim() == '' || variable.name.trim() == '' ? 'align-content-center-double-input' : 'align-content-end'}`"
      >
        <cds-button
          kind="danger-ghost"
          @click="removeItem('environmentVariables', idx)"
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
    <br />
  </div>
  <div v-else>
    <p>No Environment Variables Set</p>
  </div>
  <div class="cds--subgrid cds--subgrid--condensed">
    <p class="cds--css-grid-column cds--col-span-50">
      <strong>Metadata</strong>
    </p>
    <cds-button
      class="cds--css-grid-column cds--xlg:col-start-14 cds--lg:col-start-14 cds--md:col-start-6 cds--col-span-3"
      kind="ghost"
      @click="addItem(false, 'metadata')"
      >Add Metadata</cds-button
    >
  </div>
  <div v-if="metadata.length != 0" v-for="(entry, idx) in metadata" :key="idx">
    <div class="cds--css-grid cds--css-grid--narrow">
      <div class="cds--css-grid-column cds--lg:col-span-7 cds--md:col-span-3">
        <cds-text-input
          label="Name"
          size="lg"
          :value="entry.name"
          class="cds-theme-zone-g10"
          @input="setItem($event, false, 'metadata', idx, 'name')"
          :invalid="entry.name.trim() == ''"
          invalidText="Name can not be an empty string"
        />
      </div>
      <div class="cds--css-grid-column cds--lg:col-span-7 cds--md:col-span-3">
        <cds-text-input
          label="Value"
          size="lg"
          :value="entry.value"
          class="cds-theme-zone-g10"
          @input="setItem($event, false, 'metadata', idx, 'value')"
          :invalid="entry.value.trim() == ''"
          invalidText="Value can not be an empty string"
        />
      </div>
      <div
        :class="`cds--css-grid-column ${entry.value.trim() == '' || entry.name.trim() == '' ? 'align-content-center-double-input' : 'align-content-end'}`"
      >
        <cds-button
          kind="danger-ghost"
          @click="removeItem('metadata', idx)"
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
    <br />
  </div>
  <div v-else>
    <p>No Metadata Entries Set</p>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/text-input/index.js";

import tearsheetsSharedState from "@/stores/experimentTearsheetSharedState";

export default {
  name: "RunExperimentRuntimeOptions",
  props: {
    experiment: Object,
  },
  emits: ["required-configuration-complete"],
  data() {
    return {
      additionalRuntimeArgs: tearsheetsSharedState.additionalRuntimeArgs || [],
      environmentVariables: tearsheetsSharedState.environmentVariables || [],
      metadata: tearsheetsSharedState.metadata || [],
      tearsheetsSharedState,
    };
  },
  mounted() {
    this.updateRequiredConfigurationStatus();
  },
  computed: {
    additionalRuntimeArgsAllValid() {
      return this.additionalRuntimeArgs.every((string) => string.trim() != "");
    },
    environmentVariablesAllValid() {
      return this.environmentVariables.every(
        (obj) => obj.name.trim() != "" && obj.value.trim() != "",
      );
    },
    metadataAllValid() {
      return this.metadata.every(
        (obj) => obj.name.trim() != "" && obj.value.trim() != "",
      );
    },
  },
  methods: {
    updateTearsheetDataAndValidate(argType) {
      tearsheetsSharedState[argType] = this[argType];
      this.updateRequiredConfigurationStatus();
    },
    updateRequiredConfigurationStatus() {
      this.$emit(
        "required-configuration-complete",
        this.additionalRuntimeArgsAllValid &&
          this.environmentVariablesAllValid &&
          this.metadataAllValid,
      );
    },
    /*
      APev (24/01/2025): addItem
      @params - singleInput (boolean), argType (string)
      @function - Updates both local argType array and tearsheet shared state argType array
      and then validates the new addition. If the item added is a single input (only 1 text
      input) then an empty string is pushed to the argType array otherwise, an object with a
      name/value pair is pushed to the argType array.
    */
    addItem(singleInput, argType) {
      this[argType].push(singleInput ? "" : { name: "", value: "" });
      this.updateTearsheetDataAndValidate(argType);
    },
    onDrop(event, newIndex, array) {
      let oldIndex = event.dataTransfer.getData("initialIndex");
      let element = array.splice(oldIndex, 1)[0];
      array.splice(newIndex, 0, element);
    },
    startDrag(event, index) {
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("initialIndex", index);
    },
    /*
      APev (24/01/2025): setItem
      @params - event (object), singleInput (boolean), argType (string), idx (number),
      inputType (string)
      @function - Updates both local argType array and tearsheet shared state argType array
      with new value for existing item and then validates the new changes. If the item set is a
      single input (only 1 text input) then the new value is set with an existing item in the argType 
      array otherwise, an inputType is required to determine if the new value is an input for
      name or value.
    */
    setItem(event, singleInput, argType, idx, inputType) {
      singleInput
        ? (this[argType][idx] = event.target.value)
        : (this[argType][idx][inputType] = event.target.value);
      this.updateTearsheetDataAndValidate(argType);
    },
    /*
      APev (24/01/2025): removeItem
      @params - argType (string), index (number)
      @function - Splices index from argType array, updates tearsheet shared state and validates.
    */
    removeItem(argType, index) {
      this[argType].splice(index, 1);
      this.updateTearsheetDataAndValidate(argType);
    },
  },
};
</script>

<style scoped lang="scss">
@use "@carbon/layout";
@use "@/styles/cds-div-styles.scss";

h4 {
  padding-bottom: layout.$spacing-03;
}
div > p {
  align-content: center;
}
.draggable-text-box {
  display: flex;
}
.drag-input:active {
  cursor: grabbing !important;
}
.drag-input {
  display: block;
  height: 16px;
}
</style>
