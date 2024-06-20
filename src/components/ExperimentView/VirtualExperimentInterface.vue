<template>
  <div>
    <div class="cds--row pad1" v-if="checkVeInterfaceIsPresent(experiment)">
      <div class="cds--col-sm-4 cds--col-md-2 cds--col-lg-4">
        <dds-content-block class="ve-content-block">
          <dds-content-block-heading class="ve-heading"
            >Virtual-experiment interface</dds-content-block-heading
          >
          <div class="ve-copy">
            {{ experiment.metadata.registry.interface.description }}
          </div>
        </dds-content-block>
      </div>
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
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/structured-list.min.js";
import { checkVeInterfaceIsPresent } from "@/functions/ve_interface";
export default {
  name: "VirtualExperimentInterface",
  props: {
    experiment: Object,
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
