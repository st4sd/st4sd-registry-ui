<template>
  <div>
    <cds-overflow-menu dataTable leave-delay-ms="0" enter-delay-ms="100000">
      <img
        slot="icon"
        src="@/assets/overflow-menu--vertical.svg"
        width="20"
        height="20"
      />

      <!-- z-index required due to tearsheet z-index (9000) -->
      <cds-overflow-menu-body style="z-index: 10000">
        <cds-overflow-menu-item
          :disabled="tearsheetsSharedState.files.has(this.fileName)"
          @click="$emit('file-being-configured', true)"
          >Provide file</cds-overflow-menu-item
        >
        <cds-overflow-menu-item
          :disabled="!tearsheetsSharedState.files.has(this.fileName)"
          @click="$emit('file-being-configured', false)"
          >Edit file</cds-overflow-menu-item
        >
        <cds-overflow-menu-item
          :disabled="!tearsheetsSharedState.files.has(this.fileName)"
          danger
          @click="$emit('file-being-removed')"
          >Remove provided file</cds-overflow-menu-item
        >
      </cds-overflow-menu-body>
    </cds-overflow-menu>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/overflow-menu/index.js";
import { tearsheetsSharedState } from "@/stores/experimentTearsheetSharedState.js";

export default {
  name: "FilesTableOverflow",
  emits: ["file-being-configured", "file-being-removed"],
  props: {
    fileName: String,
  },
  data() {
    return {
      tearsheetsSharedState,
    };
  },
};
</script>
