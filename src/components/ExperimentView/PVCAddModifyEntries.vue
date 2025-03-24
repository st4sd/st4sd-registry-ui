<template>
  <div
    class="cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-8"
  >
    <cds-tile class="cds-theme-zone-white" v-if="pvcConfigurations.length == 0">
      <p><strong> No PVC entries configured.</strong></p>
      <p>Add a new PVC entry to continue.</p>
    </cds-tile>
    <div v-else>
      <cds-tile-group
        @cds-current-radio-tile-selection="
          $emit('updateRadioTileGroupSelection', $event)
        "
      >
        <cds-radio-tile
          v-for="(entry, idx) in pvcConfigurations"
          :value="entry"
          :selected="entry.id == lastSelectedPVCTile.id"
        >
          <cds-button
            size="md"
            kind="danger-ghost"
            style="position: absolute; bottom: 10px; right: 100px"
            title="Delete PVC Entry"
            @click="$emit('deletePVCEntry', idx)"
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
            title="Edit PVC Entry"
            :disabled="isInEdit"
            @click="$emit('editPVCEntry', entry)"
          >
            <img
              slot="icon"
              class="black-svg"
              width="16"
              height="16"
              src="@/assets/edit.svg"
            />
          </cds-button>
          Name: {{ entry.name }}
        </cds-radio-tile></cds-tile-group
      >
    </div>
  </div>
  <div
    class="cds--css-grid-column cds--sm:col-span-4 cds--md:col-span-8 cds--lg:col-span-8"
  >
    <cds-tile>
      <p>{{ isInEdit ? "Edit PVC Entry" : "Add a new PVC Entry" }}</p>

      <cds-inline-notification
        v-if="isInEdit"
        title="Be careful."
        subtitle="Changing the PVC name here will change it for all files referencing it."
        low-contrast
        hide-close-button
        kind="warning"
      >
      </cds-inline-notification>

      <PVCFormNewEntry
        :isInEditMode="isInEdit"
        :pvcEditEntry="pvcToEdit"
        @add-new-pvc-entry="$emit('addNewPVCEntry', $event)"
        @edit-pvc-entry="$emit('updatePVCEntry', $event)"
        @cancel-edit="$emit('updateIsInEdit', false)"
      />
    </cds-tile>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/notification/index.js";
import "@carbon/web-components/es/components/tile/index.js";
import "@carbon/web-components/es/components/button/index.js";

import PVCFormNewEntry from "./PVCFormNewEntry.vue";

export default {
  name: "PVCAddModifyEntries",
  props: {
    pvcConfigurations: Array,
    lastSelectedPVCTile: Object,
    isInEdit: Boolean,
    pvcToEdit: Object,
  },
  emits: [
    "updateRadioTileGroupSelection",
    "deletePVCEntry",
    "editPVCEntry",
    "addNewPVCEntry",
    "updatePVCEntry",
    "updateIsInEdit",
  ],
  components: {
    PVCFormNewEntry,
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
