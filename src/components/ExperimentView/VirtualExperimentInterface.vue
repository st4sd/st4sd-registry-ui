<template>
  <div>
    <div class="cds--row pad1" v-if="checkVeInterfaceIsPresent(experiment)">
      <ExperimentViewContentBlock
        title="Virtual-experiment interface"
        :subTitle="experiment.metadata.registry.interface.description"
      />
      <div class="cds--col-sm-4 cds--col-md-6 cds--col-lg-12">
        <cds-structured-list>
          <cds-structured-list-head>
            <cds-structured-list-header-row>
              <cds-structured-list-header-cell class="cds--col-sm-1"
                >Property name</cds-structured-list-header-cell
              >
              <cds-structured-list-header-cell class="cds--col-sm-3"
                >Property description</cds-structured-list-header-cell
              >
            </cds-structured-list-header-row>
          </cds-structured-list-head>
          <cds-structured-list-body>
            <cds-structured-list-row
              v-for="property in experiment.metadata.registry.interface
                .propertiesSpec"
              :key="property.name"
            >
              <cds-structured-list-cell class="cds--col-sm-1">{{
                property.name
              }}</cds-structured-list-cell>
              <cds-structured-list-cell class="cds--col-sm-3">
                {{ property.description }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
          </cds-structured-list-body>
        </cds-structured-list>
      </div>
    </div>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/structured-list/index.js";

import ExperimentViewContentBlock from "./ExperimentViewContentBlock.vue";

import { checkVeInterfaceIsPresent } from "@/functions/ve_interface";
export default {
  name: "VirtualExperimentInterface",
  props: {
    experiment: Object,
  },
  components: {
    ExperimentViewContentBlock,
  },
  methods: {
    checkVeInterfaceIsPresent,
  },
};
</script>
<style
  lang="css"
  scoped
  src="../../styles/structured-list-grid-column-styles.css"
></style>
