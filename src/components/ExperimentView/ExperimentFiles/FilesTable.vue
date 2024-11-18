<template>
  <cds-inline-notification
    v-if="!requiredFilesAreConfigured"
    class="inline-notification-style"
    lowContrast
    hideCloseButton
    kind="warning"
    title="Not all required files are configured"
    subtitle="All files marked as Missing must be configured."
  >
  </cds-inline-notification>
  <cds-table>
    <cds-table-head>
      <cds-table-header-row>
        <cds-table-header-cell isSortable>Name</cds-table-header-cell>
        <cds-table-header-cell isSortable>Type</cds-table-header-cell>
        <cds-table-header-cell isSortable>Status</cds-table-header-cell>
        <cds-table-header-cell>File actions</cds-table-header-cell>
      </cds-table-header-row>
    </cds-table-head>
    <cds-table-body>
      <cds-table-row v-for="inputFile in inputFiles">
        <cds-table-cell>{{ inputFile.name }}</cds-table-cell>
        <cds-table-cell>{{ inputTypeEnums.INPUT }}</cds-table-cell>
        <cds-table-cell
          ><FilesTableStatus
            :type="
              tearsheetsSharedState.files.has(inputFile.name)
                ? 'success'
                : 'fail'
            "
        /></cds-table-cell>
        <cds-table-cell>
          <FilesTableRowButtons
            :fileName="inputFile.name"
            @file-being-configured="
              $emit('file-being-configured', inputFile.name)
            "
            @file-being-removed="
              tearsheetsSharedState.removeConfigurationForFile(inputFile.name)
            "
          />
        </cds-table-cell>
      </cds-table-row>
      <cds-table-row v-for="executionOptionFile in executionOptionFiles">
        <cds-table-cell>{{ executionOptionFile.name }}</cds-table-cell>
        <cds-table-cell>{{ inputTypeEnums.EXECUTION_OPTION }}</cds-table-cell>
        <cds-table-cell
          ><FilesTableStatus
            :type="
              tearsheetsSharedState.files.has(executionOptionFile.name)
                ? 'success'
                : ''
            "
          />
        </cds-table-cell>
        <cds-table-cell>
          <FilesTableRowButtons
            :fileName="executionOptionFile.name"
            @file-being-configured="
              $emit('file-being-configured', executionOptionFile.name)
            "
            @file-being-removed="
              tearsheetsSharedState.removeConfigurationForFile(
                executionOptionFile.name,
              )
            "
          />
        </cds-table-cell>
      </cds-table-row>
      <cds-table-row v-for="presetFile in presetFiles">
        <cds-table-cell>{{ presetFile.name }}</cds-table-cell>
        <cds-table-cell>{{ inputTypeEnums.PRESET }}</cds-table-cell>
        <cds-table-cell><FilesTableStatus type="success" /></cds-table-cell>
        <cds-table-cell></cds-table-cell>
      </cds-table-row>
    </cds-table-body>
  </cds-table>
</template>

<script>
import "@carbon/web-components/es/components/data-table/index.js";
import "@carbon/web-components/es/components/notification/index.js";

import FilesTableStatus from "@/components/ExperimentView/ExperimentFiles/FilesTableStatus.vue";
import FilesTableRowButtons from "@/components/ExperimentView/ExperimentFiles/FilesTableRowButtons.vue";
import { tearsheetsSharedState } from "@/stores/experimentTearsheetSharedState.js";

import inputTypeEnums from "@/enums/inputTypeEnums.js";

export default {
  name: "FilesTable",
  emits: ["file-being-configured"],
  props: {
    experiment: Object,
  },
  components: {
    FilesTableStatus,
    FilesTableRowButtons,
  },
  data() {
    return {
      inputTypeEnums,
      tearsheetsSharedState,
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
    requiredFilesAreConfigured() {
      return this.inputFiles.every((input) =>
        tearsheetsSharedState.files.has(input.name),
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@carbon/layout";
cds-table {
  margin-top: layout.$spacing-05;
}

.inline-notification-style {
  margin: layout.$spacing-03 0;
}
</style>
