<template>
  <div v-if="checkVeInterfaceIsPresent(experiment)" class="cds--row pad1">
    <div class="cds--col-lg-4">
      <dds-content-block class="ve-content-block">
        <dds-content-block-heading class="ve-heading"
          >Virtual-experiment interface</dds-content-block-heading
        >
        <div class="ve-copy">
          {{ experiment.metadata.registry.interface.description }}
        </div>
      </dds-content-block>
    </div>
    <div class="cds--col">
      <dds-structured-list>
        <dds-structured-list-head>
          <dds-structured-list-header-row>
            <dds-structured-list-header-cell
              >Property name</dds-structured-list-header-cell
            >
            <dds-structured-list-header-cell
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
            <dds-structured-list-cell>{{
              property.name
            }}</dds-structured-list-cell>
            <dds-structured-list-cell>
              {{ property.description }}
            </dds-structured-list-cell>
          </dds-structured-list-row>
        </dds-structured-list-body>
      </dds-structured-list>
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

<style></style>
