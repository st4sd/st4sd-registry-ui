<template>
  <div class="cds--row pad1">
    <ExperimentViewContentBlock title="Container images" />
    <div class="cds--col-sm-4 cds--col-md-6 cds--col-lg-12">
      <cds-structured-list>
        <cds-structured-list-head>
          <cds-structured-list-header-row>
            <cds-structured-list-header-cell
              >Image name</cds-structured-list-header-cell
            >
          </cds-structured-list-header-row>
        </cds-structured-list-head>
        <cds-structured-list-body>
          <cds-structured-list-row
            v-for="(containerImage, idx) in experiment.metadata.registry
              .containerImages"
            :key="idx"
          >
            <cds-structured-list-cell>{{
              containerImage.name
            }}</cds-structured-list-cell>
          </cds-structured-list-row>
        </cds-structured-list-body>
      </cds-structured-list>
    </div>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/structured-list/index.js";

import ExperimentViewContentBlock from "./ExperimentViewContentBlock.vue";

export default {
  name: "PackageInfoContainer",
  props: {
    experiment: Object,
  },
  components: {
    ExperimentViewContentBlock,
  },
};
</script>
<style lang="scss" scoped>
@use "@/styles/structured-list-grid-column-styles.scss";
</style>
