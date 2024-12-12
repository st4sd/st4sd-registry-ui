<template>
  <cds-form-group class="cds--grid">
    <cds-text-input
      :value="configuration.name"
      @input="configuration.name = $event.target.value"
      label="Name"
      :disabled="disableForm"
      :invalid="!configuration.isValid() && !disableForm"
      :invalidText="datashimDatasetInvalidString"
    />
    <br />
    <div>
      <cds-button
        v-if="isInEditMode"
        size="md"
        title="Cancel edits"
        kind="tertiary"
        @click="(resetForm(), $emit('cancel-edit'))"
        >Cancel edit
      </cds-button>
      <cds-button
        v-else
        size="md"
        title="Reset values"
        kind="tertiary"
        :disabled="disableForm"
        @click="resetForm"
        >Clear
      </cds-button>
      <cds-button
        size="md"
        :title="isInEditMode ? 'Confirm' : 'Add'"
        @click="handleUserConfirmation"
        :disabled="!configuration.isValid(isInEditMode) || disableForm"
        >{{ primaryButtonText }}
      </cds-button>
    </div>
  </cds-form-group>
</template>

<script>
import "@carbon/web-components/es/components/form-group/index.js";
import "@carbon/web-components/es/components/text-input/index.js";
import "@carbon/web-components/es/components/button/index.js";

import {
  DatashimDatasetConfiguration,
  datashimDatasetInvalidString,
} from "@/classes/DatashimDatasetConfiguration.js";

import { tearsheetsSharedState } from "@/stores/experimentTearsheetSharedState";

export default {
  name: "DatashimFormNewEntry",
  emits: ["add-new-datashim-entry", "edit-datashim-entry", "cancel-edit"],
  props: {
    isInEditMode: Boolean,
    datasetEditConfiguration: {
      type: DatashimDatasetConfiguration,
      default: new DatashimDatasetConfiguration(),
    },
    disableForm: Boolean,
  },
  watch: {
    isInEditMode: {
      immediate: true,
      handler(newEditValue) {
        if (newEditValue)
          this.configuration = this.datasetEditConfiguration.clone();
        else this.resetForm();
      },
    },
  },
  computed: {
    primaryButtonText() {
      return this.isInEditMode ? "Apply changes" : "Add dataset";
    },
  },
  data() {
    return {
      configuration: this.datasetEditConfiguration.clone(),
      tearsheetsSharedState,
      datashimDatasetInvalidString,
    };
  },
  methods: {
    handleUserConfirmation() {
      let eventName = this.isInEditMode
        ? "edit-datashim-entry"
        : "add-new-datashim-entry";
      this.$emit(eventName, this.configuration);
      this.resetForm();
    },
    resetForm() {
      this.configuration = new DatashimDatasetConfiguration();
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@carbon/layout";
@use "@carbon/grid";

cds-button {
  padding-right: layout.$spacing-03;
}
</style>
