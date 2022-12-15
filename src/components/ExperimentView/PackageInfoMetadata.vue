<template>
  <cv-row class="pad1">
    <cv-column :sm="4" :md="2" :lg="4">
      <dds-content-block class="ve-content-block">
        <dds-content-block-heading class="ve-heading"
          >Metadata</dds-content-block-heading
        >
      </dds-content-block>
    </cv-column>
    <cv-column :sm="4" :md="6" :lg="12">
      <dds-structured-list>
        <dds-structured-list-body>
          <dds-structured-list-row>
            <dds-structured-list-cell
              class="cds--col-lg-4"
              tooltip="Contributed experiments have been developed or accepted by the core ST4SD team"
              >Contributed</dds-structured-list-cell
            ><dds-structured-list-cell
              class="cds--col-lg-12"
              v-if="checkExperimentIsContributed(experiment)"
              ><img
                width="20"
                height="20"
                class="success-green"
                src="../../assets/checkmark--filled.svg"
            /></dds-structured-list-cell>
            <dds-structured-list-cell class="cds--col-lg-12" v-else
              ><img
                width="20"
                height="20"
                class="fail-red"
                src="../../assets/misuse.svg"
            /></dds-structured-list-cell>
          </dds-structured-list-row>
          <dds-structured-list-row>
            <dds-structured-list-cell class="cds--col-lg-4"
              >License</dds-structured-list-cell
            ><dds-structured-list-cell
              class="cds--col-lg-12"
              v-if="experiment.metadata.package.license == null"
              tooltip="Reach out to the maintainer"
            >
              Not available
            </dds-structured-list-cell>
            <dds-structured-list-cell class="cds--col-lg-12" v-else>
              {{ experiment.metadata.package.license }}
            </dds-structured-list-cell>
          </dds-structured-list-row>
          <dds-structured-list-row>
            <dds-structured-list-cell class="cds--col-lg-4"
              >Maintainer</dds-structured-list-cell
            ><dds-structured-list-cell class="cds--col-lg-12">
              {{ experiment.metadata.package.maintainer }}
            </dds-structured-list-cell>
          </dds-structured-list-row>
          <dds-structured-list-row>
            <dds-structured-list-cell class="cds--col-lg-4">
              Available tags
            </dds-structured-list-cell>
            <dds-structured-list-cell
              class="cds--col-lg-12"
              :tags="tags"
            ></dds-structured-list-cell>
          </dds-structured-list-row>
          <dds-structured-list-row>
            <dds-structured-list-cell class="cds--col-lg-4">
              Available platforms
            </dds-structured-list-cell>
            <dds-structured-list-cell
              class="cds--col-lg-12"
              :tags="getAvailablePlatforms"
            ></dds-structured-list-cell>
          </dds-structured-list-row>
          <dds-structured-list-row>
            <dds-structured-list-cell class="cds--col-lg-4"
              >Keywords</dds-structured-list-cell
            >
            <dds-structured-list-cell
              class="cds--col-lg-12"
              :tags="experiment.metadata.package.keywords"
            >
            </dds-structured-list-cell>
          </dds-structured-list-row>
        </dds-structured-list-body>
      </dds-structured-list>
    </cv-column>
  </cv-row>
</template>

<script>
import { checkExperimentIsContributed } from "@/functions/origin_checks";
export default {
  name: "PackageInfoMetadata",
  props: {
    tags: Array,
    experiment: Object,
    getAvailablePlatforms: Array,
  },
  methods: {
    checkExperimentIsContributed,
  },
};
</script>
