<template>
  <cds-tearsheet
    class="cds-theme-zone-g10"
    :open="isOpen"
    data-index="two"
    hasCloseIcon
    width="wide"
    @cds-tearsheet-closed="$emit('cds-tearsheet-closed')"
  >
    <h3 slot="title">Provide a file for {{ fileInfo.file.name }}</h3>
    <p slot="description">
      Use the tabs to choose how you want to provide the file.
    </p>
    <div slot="header-navigation">
      <cds-tabs :value="options[0]">
        <cds-tab disabled v-for="option in options" :value="option">{{
          option
        }}</cds-tab>
      </cds-tabs>
    </div>
    {{ fileInfo.type }}
  </cds-tearsheet>
</template>

<script>
import "@carbon/web-components/es/components/tearsheet/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/tabs/index.js";

export default {
  name: "FileConfigurationTearsheet",
  props: {
    fileInfo: Object,
    isOpen: Boolean,
  },
  emits: ["cds-tearsheet-closed"],
  data() {
    return {
      options: ["Upload", "S3", "PVC", "Datashim", "Application Dependencies"],
    };
  },
};
</script>
