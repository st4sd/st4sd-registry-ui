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
  <cds-table-toolbar>
    <cds-table-toolbar-content>
      <cds-table-toolbar-search
        id="search"
        persistent
        placeholder="Search by name"
        @cds-search-input="searchQuery = $event.detail.value"
      ></cds-table-toolbar-search>
    </cds-table-toolbar-content>
    <FilesTableFilter
      @filter-status-selection-updated="allowedFileStatuses = $event"
      @filter-type-selection-updated="allowedFileTypes = $event"
    />
  </cds-table-toolbar>
  <!-- AP 21/11/24
    Due to the way the cds-table's sorting works, we would end up
    with a lot of duplicated rows if we searched and then clicked
    on a header for sorting the table. This would happen even if 
    we were returning the correct data.
    By adding a variable that we update and adding it as a key on
    the table-body, we force it to re-render, preventing these ghost
    rows from appearing
  -->
  <cds-table @cds-table-header-cell-sort="sortTrigger++">
    <cds-table-head>
      <cds-table-header-row>
        <cds-table-header-cell isSortable>Name</cds-table-header-cell>
        <cds-table-header-cell isSortable>Type</cds-table-header-cell>
        <cds-table-header-cell isSortable>Status</cds-table-header-cell>
        <cds-table-header-cell>File actions</cds-table-header-cell>
      </cds-table-header-row>
    </cds-table-head>
    <cds-table-body :key="sortTrigger">
      <cds-table-row v-for="file in filesMatchingQuery">
        <cds-table-cell>{{ file.entry.name }}</cds-table-cell>
        <cds-table-cell>{{ file.type }}</cds-table-cell>
        <cds-table-cell
          ><FilesTableStatus :type="statusForFile(file)"
        /></cds-table-cell>
        <cds-table-cell
          ><FilesTableRowButtons
            v-if="file.type != inputTypeEnums.PRESET"
            :fileName="file.entry.name"
            @file-being-configured="
              $emit('file-being-configured', file.entry.name)
            "
            @file-being-removed="
              tearsheetsSharedState.removeConfigurationForFile(file.entry.name)
            "
        /></cds-table-cell>
      </cds-table-row>
    </cds-table-body>
  </cds-table>
  <NoDataEmptyState v-if="allFiles.length == 0" theme="cds-theme-zone-g10" />
  <NoSearchResultsEmptyState
    v-else-if="filesMatchingQuery.length == 0"
    theme="cds-theme-zone-g10"
  />
</template>

<script>
import "@carbon/web-components/es/components/data-table/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/notification/index.js";

import FilesTableStatus from "@/components/ExperimentView/ExperimentFiles/FilesTableStatus.vue";
import FilesTableRowButtons from "@/components/ExperimentView/ExperimentFiles/FilesTableRowButtons.vue";
import FilesTableFilter from "@/components/ExperimentView/ExperimentFiles/FilesTableFilter.vue";
import NoSearchResultsEmptyState from "@/components/EmptyState/NoSearchResultsEmptyState.vue";
import NoDataEmptyState from "@/components/EmptyState/NoDataEmptyState.vue";

import tearsheetsSharedState from "@/stores/experimentTearsheetSharedState.js";

import inputTypeEnums from "@/enums/inputTypeEnums.js";
import statusTypeEnums from "@/enums/statusTypeEnums";

export default {
  name: "FilesTable",
  emits: ["file-being-configured", "required-configuration-complete"],
  props: {
    experiment: Object,
  },
  components: {
    FilesTableStatus,
    FilesTableRowButtons,
    FilesTableFilter,
    NoDataEmptyState,
    NoSearchResultsEmptyState,
  },
  data() {
    return {
      sortTrigger: 0,
      inputTypeEnums,
      statusTypeEnums,
      tearsheetsSharedState,
      allowedFileTypes: new Set([
        inputTypeEnums.INPUT,
        inputTypeEnums.EXECUTION_OPTION,
        inputTypeEnums.PRESET,
      ]),
      allowedFileStatuses: new Set([
        statusTypeEnums.MISSING,
        statusTypeEnums.SET,
        statusTypeEnums.UNSET,
      ]),
      searchQuery: "",
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
    allFiles() {
      let mappedInputFiles = this.inputFiles.map((file) => {
        return { entry: file, type: inputTypeEnums.INPUT };
      });
      let mappedExecutionOptions = this.executionOptionFiles.map((file) => {
        return { entry: file, type: inputTypeEnums.EXECUTION_OPTION };
      });

      let mappedPresets = this.presetFiles.map((file) => {
        return { entry: file, type: inputTypeEnums.PRESET };
      });

      return mappedInputFiles
        .concat(mappedExecutionOptions)
        .concat(mappedPresets);
    },
    filesMatchingFilters() {
      return this.allFiles.filter(
        (file) =>
          this.allowedFileTypes.has(file.type) &&
          this.allowedFileStatuses.has(this.statusForFile(file)),
      );
    },
    filesMatchingQuery() {
      let query = this.searchQuery.trim().toLowerCase();
      if (query == "") {
        return this.filesMatchingFilters;
      }

      return this.filesMatchingFilters.filter((file) =>
        file.entry.name.toLowerCase().includes(query),
      );
    },
    requiredFilesAreConfigured() {
      let result = this.inputFiles.every((input) =>
        tearsheetsSharedState.files.has(input.name),
      );
      this.$emit("required-configuration-complete", result);
      return result;
    },
  },
  methods: {
    statusForFile(file) {
      switch (file.type) {
        case inputTypeEnums.PRESET:
          return statusTypeEnums.SET;
        case inputTypeEnums.EXECUTION_OPTION:
          return tearsheetsSharedState.files.has(file.entry.name)
            ? statusTypeEnums.SET
            : statusTypeEnums.UNSET;
        case inputTypeEnums.INPUT:
          return tearsheetsSharedState.files.has(file.entry.name)
            ? statusTypeEnums.SET
            : statusTypeEnums.MISSING;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@carbon/layout";

cds-table-toolbar {
  margin-top: layout.$spacing-05;
}

.inline-notification-style {
  margin: layout.$spacing-03 0;
}
</style>
