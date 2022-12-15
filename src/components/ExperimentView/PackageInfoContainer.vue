<template>
  <cv-row class="pad1">
    <cv-column :sm="4" :md="2" :lg="4">
      <dds-content-block class="ve-content-block">
        <dds-content-block-heading class="ve-heading"
          >Container images</dds-content-block-heading
        >
      </dds-content-block>
    </cv-column>
    <cv-column :sm="4" :md="6" :lg="12">
      <dds-structured-list>
        <dds-structured-list-head>
          <dds-structured-list-header-row>
            <dds-structured-list-header-cell
              >Image name</dds-structured-list-header-cell
            >
          </dds-structured-list-header-row>
        </dds-structured-list-head>
        <dds-structured-list-body>
          <dds-structured-list-row
            v-for="(containerImage, idx) in experiment.metadata.registry
              .containerImages"
            :key="idx"
          >
            <dds-structured-list-cell>{{
              containerImage.name
            }}</dds-structured-list-cell>
          </dds-structured-list-row>
        </dds-structured-list-body>
      </dds-structured-list>
    </cv-column>
  </cv-row>
</template>

<script>
export default {
  name: "PackageInfoContainer",
  props: {
    experiment: Object,
  },
};
</script>
