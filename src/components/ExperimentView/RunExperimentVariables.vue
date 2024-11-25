<template>
  <h4>Variables</h4>
  <p>
    <strong>View and override the values of the experiment variables</strong>
  </p>
  <p>
    Disclose items in the Configurable section to override defaults. Inspect
    unmodifiable values in the Preset section.
  </p>
  <div v-if="experiment.parameterisation.executionOptions.variables.length > 0">
    <h5>Configurable</h5>
    <cds-accordion>
      <cds-accordion-item
        v-for="executionOptionVariable in experiment.parameterisation
          .executionOptions.variables"
        :title="executionOptionVariable.name"
      >
        <cds-dropdown
          v-if="executionOptionVariable?.valueFrom"
          :value="executionOptionVariable.valueFrom[0].value"
          @cds-dropdown-selected="
            executionOptionVariable.value = $event.target.value
          "
        >
          <cds-dropdown-item
            v-for="valueFrom in executionOptionVariable.valueFrom"
            :value="valueFrom.value"
            >{{ valueFrom.value }}</cds-dropdown-item
          >
        </cds-dropdown>
        <cds-text-input
          :value="executionOptionVariable?.value"
          placeholder="Leave blank to use platform defaults"
          @input="executionOptionVariable.value = $event.target.value"
          v-else
        ></cds-text-input>
      </cds-accordion-item>
    </cds-accordion>
  </div>
  <div v-if="experiment.parameterisation.presets.variables.length > 0">
    <h5>Preset</h5>
    <cds-structured-list condensed>
      <cds-structured-list-body>
        <cds-structured-list-row
          v-for="executionOptionPreset in experiment.parameterisation.presets
            .variables"
        >
          <cds-structured-list-cell style="vertical-align: middle">{{
            executionOptionPreset.name
          }}</cds-structured-list-cell>
          <cds-structured-list-cell
            ><cds-text-input :value="executionOptionPreset.value" readonly />
          </cds-structured-list-cell>
        </cds-structured-list-row>
      </cds-structured-list-body>
    </cds-structured-list>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/accordion/index.js";
import "@carbon/web-components/es/components/dropdown/index.js";
import "@carbon/web-components/es/components/text-input/index.js";
import "@carbon/web-components/es/components/structured-list/index.js";

export default {
  name: "RunExperimentVariables",
  props: {
    experiment: Object,
  },
  emits: ["required-configuration-complete"],
  mounted() {
    this.$emit("required-configuration-complete", true);
  },
};
</script>

<style scoped lang="scss">
@use "@carbon/layout";
h4 {
  padding-bottom: layout.$spacing-03;
}

h5 {
  padding: layout.$spacing-06 0;
}
</style>
