<template>
  <div class="cds--row pad1">
    <div class="cds--col-lg-4">
      <dds-content-block class="ve-content-block">
        <dds-content-block-heading class="ve-heading"
          >Container images</dds-content-block-heading
        >
      </dds-content-block>
    </div>
    <div class="cds--col">
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
    </div>
  </div>
</template>

<script>
export default {
  name: "PackageInfoContainer",
  props: {
    experiment: Object,
  },
};
</script>

<style></style>
