<template>
  <cds-overflow-menu dataTable leave-delay-ms="0" enter-delay-ms="100000">
    <img
      slot="icon"
      src="@/assets/overflow-menu--vertical.svg"
      width="20"
      height="20"
    />
    <!-- z-index required due to tearsheet z-index (9000) -->
    <cds-overflow-menu-body style="z-index: 10000">
      <cds-overflow-menu-item @click="$emit('fileChanged', true)"
        >Provide file</cds-overflow-menu-item
      >
      <cds-overflow-menu-item>Edit file</cds-overflow-menu-item>
      <cds-overflow-menu-item danger @click="$emit('fileChanged', false)"
        >Remove provided file</cds-overflow-menu-item
      >
    </cds-overflow-menu-body>
  </cds-overflow-menu>
</template>

<script>
import "@carbon/web-components/es/components/overflow-menu/index.js";

export default {
  name: "FilesTableOverflow",
  emits: ["fileChanged"],
};
</script>
