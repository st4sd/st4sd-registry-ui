<template>
  <cds-table>
    <cds-table-head>
      <cds-table-header-row>
        <cds-table-header-cell>Name</cds-table-header-cell>
        <cds-table-header-cell>Type</cds-table-header-cell>
        <cds-table-header-cell>Status</cds-table-header-cell>
        <cds-table-header-cell></cds-table-header-cell>
      </cds-table-header-row>
    </cds-table-head>
    <cds-table-body>
      <cds-table-row v-for="inputFile in inputFiles">
        <cds-table-cell>{{ inputFile.name }}</cds-table-cell>
        <cds-table-cell>{{ inputTypeEnums.INPUT }}</cds-table-cell>
        <cds-table-cell><FilesTableStatus type="fail" /></cds-table-cell>
        <cds-table-cell
          ><FilesTableOverflow
            @file-being-configured="
              fileChanged(inputFile, inputTypeEnums.INPUT)
            "
            @file-being-removed="removeFile(inputFile)"
        /></cds-table-cell>
      </cds-table-row>
      <cds-table-row v-for="executionOptionFile in executionOptionFiles">
        <cds-table-cell>{{ executionOptionFile.name }}</cds-table-cell>
        <cds-table-cell>{{ inputTypeEnums.EXECUTION_OPTION }}</cds-table-cell>
        <cds-table-cell><FilesTableStatus type="" /></cds-table-cell>
        <cds-table-cell
          ><FilesTableOverflow
            @file-being-configured="
              fileChanged(executionOptionFile, inputTypeEnums.EXECUTION_OPTION)
            "
            @file-being-removed="removeFile(executionOptionFile)"
        /></cds-table-cell>
      </cds-table-row>
      <cds-table-row v-for="presetFile in presetFiles">
        <cds-table-cell>{{ presetFile.name }}</cds-table-cell>
        <cds-table-cell>{{ inputTypeEnums.PRESET }}</cds-table-cell>
        <cds-table-cell><FilesTableStatus type="success" /></cds-table-cell>
        <cds-table-cell
          ><FilesTableOverflow
            @file-being-configured="
              fileChanged(presetFile, inputTypeEnums.PRESET)
            "
            @file-being-removed="removeFile(presetFile)"
        /></cds-table-cell>
      </cds-table-row>
    </cds-table-body>
  </cds-table>
</template>

<script>
import "@carbon/web-components/es/components/data-table/index.js";

import FilesTableOverflow from "@/components/ExperimentView/ExperimentFiles/FilesTableOverflow.vue";
import FilesTableStatus from "@/components/ExperimentView/ExperimentFiles/FilesTableStatus.vue";

import inputTypeEnums from "@/enums/inputTypeEnums.js";

export default {
  name: "FilesTable",
  emits: ["configure-file"],
  props: {
    experiment: Object,
  },
  components: {
    FilesTableOverflow,
    FilesTableStatus,
  },
  data() {
    return {
      inputTypeEnums,
    };
  },
  computed: {
    inputFiles() {
      return this.experiment.metadata.registry.inputs;
    },
    executionOptionFiles() {
      return this.experiment.parameterisation.executionOptions.data;
    },
    presetFiles() {
      return this.experiment.metadata.registry.data.filter(
        (file) => !this.executionOptionFiles.some((f) => f.name == file.name),
      );
    },
  },
  methods: {
    fileChanged(file, type) {
      this.$emit("configure-file", { file, type });
    },
    removeFile(file) {
      console.log(file);
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@carbon/layout";
cds-table {
  margin-top: layout.$spacing-05;
}
</style>
