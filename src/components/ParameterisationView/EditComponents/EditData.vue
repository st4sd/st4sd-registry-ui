<template>
  <cds-checkbox
    :label-text="`${this.data.name}`"
    :checked="!preset"
    @cds-checkbox-changed="setNewDataType()"
  ></cds-checkbox>
</template>

<script>
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/checkbox.min.js";
export default {
  name: "ExperimentView",
  props: {
    parameterisation: Object,
    executionOptionsData: Array,
    file: Object,
    idx: Number,
  },
  data() {
    return {
      parameterisationPayload: null,
      payloadSet: false,
      preset: null,
      data: null,
      index: null,
    };
  },
  watch: {
    parameterisation: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler(val) {
        if (this.payloadSet == false) {
          this.parameterisationPayload = val;
        }
        this.payloadSet = true;
      },
    },
    file: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler(val) {
        this.data = val;
        let executionOptionFileNames = this.executionOptionsData.map(
          (file) => file.name,
        );
        this.preset = !executionOptionFileNames.includes(this.file.name);
        this.index = this.parameterisationPayload.executionOptions.data.indexOf(
          this.data.name,
        );
      },
    },
  },
  methods: {
    toggleDataType() {
      this.preset = !this.preset;
    },
    setNewDataType() {
      if (this.preset == false) {
        this.setPresetType();
      } else {
        this.setExecutionOptionType();
      }
    },
    setPresetType() {
      this.toggleDataType();
      this.index = this.parameterisationPayload.executionOptions.data.findIndex(
        (data) => data.name == this.data.name,
      );
      this.parameterisationPayload.executionOptions.data.splice(this.index, 1);
      this.emitNewOptions();
    },
    setExecutionOptionType() {
      this.toggleDataType();
      // add data to execution options
      this.parameterisationPayload.executionOptions.data.push({
        name: this.data.name,
      });
      this.emitNewOptions();
    },
    emitNewOptions() {
      this.$emit("newDataType", this.parameterisationPayload);
    },
  },
};
</script>
