<template>
  <cds-button
    class="button-spacing"
    title="Configure file"
    kind="ghost"
    size="sm"
    @click="$emit('file-being-configured')"
  >
    <img
      class="drak-gray-svg"
      slot="icon"
      width="16"
      height="16"
      src="@/assets/edit.svg"
    />
  </cds-button>
  <cds-button
    title="Remove file configuration"
    kind="danger-ghost"
    size="sm"
    @click="$emit('file-being-removed')"
    :disabled="!tearsheetsSharedState.files.has(this.fileName)"
  >
    <img
      slot="icon"
      class="drak-gray-svg"
      width="16"
      height="16"
      src="@/assets/reset.svg"
    />
  </cds-button>
</template>

<script>
import "@carbon/web-components/es/components/button/index.js";

import tearsheetsSharedState from "@/stores/experimentTearsheetSharedState.js";

export default {
  name: "FilesTableRowButtons",
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

<style lang="scss" scoped>
@use "@carbon/layout";

.button-spacing {
  padding-right: layout.$spacing-03;
}
</style>
