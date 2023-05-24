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
        <dds-structured-list>
          <dds-structured-list-head>
            <dds-structured-list-header-row>
              <dds-structured-list-header-cell class="cds--col-sm-1"
                >Property name</dds-structured-list-header-cell
              >
              <dds-structured-list-header-cell class="cds--col-sm-3"
                >Property description</dds-structured-list-header-cell
              >
            </dds-structured-list-header-row>
          </dds-structured-list-head>
          <dds-structured-list-body>
            <dds-structured-list-row
              v-for="property in experiment.metadata.registry.interface
                .propertiesSpec"
              :key="property.name"
            >
              <dds-structured-list-cell class="cds--col-sm-1">{{
                property.name
              }}</dds-structured-list-cell>
              <dds-structured-list-cell class="cds--col-sm-3">
                {{ property.description }}
              </dds-structured-list-cell>
            </dds-structured-list-row>
          </dds-structured-list-body>
        </dds-structured-list>
      </div>
    </div>
  </div>
</template>

<script>
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
