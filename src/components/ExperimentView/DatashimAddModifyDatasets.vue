<template>
  <div
    class="cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-8"
  >
    <cds-tile
      class="cds-theme-zone-white"
      v-if="datasetConfigurations.length == 0"
    >
      <p><strong>No Datasets configured.</strong></p>
      <p>Add a new Dataset to continue.</p>
    </cds-tile>
    <div v-else>
      <cds-tile-group
        @cds-current-radio-tile-selection="
          $emit('updateRadioTileGroupSelection', $event)
        "
      >
        <cds-radio-tile
          v-for="(dataset, idx) in datasetConfigurations"
          :value="dataset"
          :selected="dataset.id == lastSelectedDatashimTile.id"
        >
          <cds-button
            size="md"
            kind="danger-ghost"
            style="position: absolute; bottom: 10px; right: 100px"
            title="Remove Dataset"
            @click="$emit('deleteDatasetConfiguration', idx)"
          >
            <img
              slot="icon"
              width="16"
              height="16"
              src="@/assets/trash-can.svg"
            />
          </cds-button>
          <cds-button
            size="md"
            kind="ghost"
            style="position: absolute; bottom: 10px; right: 150px"
            title="Edit Dataset"
            :disabled="this.isInEdit"
            @click="$emit('editDatasetConfiguration', dataset)"
          >
            <img
              slot="icon"
              class="black-svg"
              width="16"
              height="16"
              src="@/assets/edit.svg"
            />
          </cds-button>
          Name: {{ dataset.name }}
        </cds-radio-tile></cds-tile-group
      >
    </div>
  </div>
  <div
    class="cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-8"
  >
    <cds-tile>
      <p>
        {{
          isInEdit
            ? "Edit Dataset Configuration"
            : "Add a new Dataset Configuration"
        }}
      </p>

      <cds-inline-notification
        v-if="datasetConfigurations.length != 0 && !isInEdit"
        title="Only one Dataset is allowed."
        subtitle="You can only delete or edit the available configuration."
        low-contrast
        hide-close-button
        kind="warning"
      />
      <cds-inline-notification
        v-else-if="isInEdit"
        title="Be careful."
        subtitle="Changing the Dataset here will change it for all files referencing it."
        low-contrast
        hide-close-button
        kind="warning"
      />

      <DatashimFormNewEntry
        :isInEditMode="isInEdit"
        :datasetEditConfiguration="datasetToEdit"
        :disableForm="datasetConfigurations.length != 0 && !isInEdit"
        @add-new-datashim-entry="$emit('addNewDatasetConfiguration', $event)"
        @edit-datashim-entry="$emit('updateDatasetConfiguration', $event)"
        @cancel-edit="$emit('updateIsInEdit', false)"
      />
    </cds-tile>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/notification/index.js";
import "@carbon/web-components/es/components/tile/index.js";
import "@carbon/web-components/es/components/button/index.js";

import DatashimFormNewEntry from "@/components/ExperimentView/DatashimFormNewEntry.vue";

export default {
  name: "DatashimAddModifyDatasets",
  props: {
    datasetConfigurations: Array,
    lastSelectedDatashimTile: Object,
    isInEdit: Boolean,
    datasetToEdit: Object,
  },
  emits: [
    "updateRadioTileGroupSelection",
    "deleteDatasetConfiguration",
    "editDatasetConfiguration",
    "addNewDatasetConfiguration",
    "updateDatasetConfiguration",
    "updateIsInEdit",
  ],
  components: {
    DatashimFormNewEntry,
  },
};
</script>

<style scoped lang="scss">
@use "@carbon/layout";
@use "@carbon/grid";

cds-inline-notification {
  margin-top: layout.$spacing-05;
}
</style>
