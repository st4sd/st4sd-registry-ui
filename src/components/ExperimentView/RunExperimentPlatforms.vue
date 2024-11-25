<template>
  <h4>Platforms</h4>
  <p>
    <strong>View and override the platform for this experiment</strong>
  </p>

  <div
    v-if="
      experiment.parameterisation.presets?.platform &&
      experiment.parameterisation.presets.platform.trim() != ''
    "
  >
    <p>
      This experiment has a preset platform, meaning you will not be able to
      select a different one.
    </p>
    <br />
    <cds-text-input
      class="cds-theme-zone-g10"
      label="Preset platform"
      :value="experiment.parameterisation.presets.platform"
      readonly
    />
  </div>
  <div
    v-else-if="
      experiment.parameterisation.executionOptions.platform.length == 0
    "
  >
    <p>
      This experiment only has a default platform, meaning you will not be able
      to select a different one.
    </p>
    <br />
    <cds-text-input
      class="cds-theme-zone-g10"
      label="Available platform"
      value="default"
      readonly
    />
  </div>
  <div v-else>
    <p>
      Use the dropdown to select which platform you want the experiment to use.
    </p>
    <br />
    <cds-dropdown
      :value="experiment.parameterisation.executionOptions.selectedPlatform"
      @cds-dropdown-selected="
        experiment.parameterisation.executionOptions.selectedPlatform =
          $event.target.value
      "
      class="cds-theme-zone-g10"
      titleText="Available platforms"
    >
      <cds-dropdown-item
        v-for="(platform, idx) in experiment.parameterisation.executionOptions
          .platform"
        :key="idx"
        :value="platform"
      >
        {{ platform }}
      </cds-dropdown-item>
    </cds-dropdown>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/text-input/index.js";
import "@carbon/web-components/es/components/dropdown/index.js";

export default {
  name: "RunExperimentPlatforms",
  props: {
    experiment: Object,
  },
  emits: ["required-configuration-complete"],
  mounted() {
    if (
      this.experiment.parameterisation.executionOptions?.platform.length > 0 &&
      !this.experiment.parameterisation.executionOptions?.selectedPlatform
    ) {
      this.experiment.parameterisation.executionOptions.selectedPlatform =
        this.experiment.parameterisation.executionOptions.platform[0];
    }
    this.$emit("required-configuration-complete", true);
  },
};
</script>

<style scoped lang="scss">
@use "@carbon/layout";
h4 {
  padding-bottom: layout.$spacing-03;
}
</style>
