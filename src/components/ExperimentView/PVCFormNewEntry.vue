<template>
  <cds-form-group class="cds--grid">
    <cds-text-input
      :value="configuration.name"
      @input="configuration.name = $event.target.value"
      label="Name"
      :invalid="
        !configuration.isValid() ||
        !tearsheetsSharedState.hasPVCWithName(configuration.name)
      "
      :invalid-text="pvcInvalidString"
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
        @click="resetForm"
        >Clear
      </cds-button>
      <cds-button
        size="md"
        :title="isInEditMode ? 'Confirm' : 'Add'"
        @click="handleUserConfirmation"
        :disabled="
          !configuration.isValid() ||
          !tearsheetsSharedState.hasPVCWithName(configuration.name)
        "
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
  PVCConfiguration,
  pvcInvalidString,
} from "@/classes/PVCConfiguration.js";

import { tearsheetsSharedState } from "@/stores/experimentTearsheetSharedState";

export default {
  name: "PVCFormNewEntry",
  emits: ["add-new-pvc-entry", "edit-pvc-entry", "cancel-edit"],
  props: {
    isInEditMode: Boolean,
    pvcEditEntry: {
      type: PVCConfiguration,
      default: new PVCConfiguration(),
    },
  },
  watch: {
    isInEditMode: {
      immediate: true,
      handler(newEditValue) {
        if (newEditValue) this.configuration = this.pvcEditEntry.clone();
        else this.resetForm();
      },
    },
  },
  computed: {
    primaryButtonText() {
      return this.isInEditMode ? "Apply changes" : "Add entry";
    },
  },
  data() {
    return {
      configuration: this.pvcEditEntry.clone(),
      tearsheetsSharedState,
      pvcInvalidString,
    };
  },
  methods: {
    handleUserConfirmation() {
      let eventName = this.isInEditMode
        ? "edit-pvc-entry"
        : "add-new-pvc-entry";
      this.$emit(eventName, this.configuration);
      this.resetForm();
    },
    resetForm() {
      this.configuration = new PVCConfiguration();
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
