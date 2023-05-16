<template>
  <div class="cds--row pad1">
    <div class="cds--col-sm-4 cds--col-md-2 cds--col-lg-4">
      <dds-content-block class="ve-content-block">
        <dds-content-block-heading class="ve-heading"
          >Metadata</dds-content-block-heading
        >
      </dds-content-block>
    </div>
    <div class="cds--col-sm-4 cds--col-md-6 cds--col-lg-12">
      <dds-structured-list>
        <dds-structured-list-body>
          <dds-structured-list-row>
            <dds-structured-list-cell
              class="cds--col-sm-1"
              tooltip="Contributed experiments have been developed or accepted by the core ST4SD team"
              >Contributed</dds-structured-list-cell
            ><dds-structured-list-cell
              class="cds--col-sm-3"
              v-if="checkExperimentIsContributed(experiment)"
              ><img
                width="20"
                height="20"
                class="success-green"
                src="../../assets/checkmark--filled.svg"
            /></dds-structured-list-cell>
            <dds-structured-list-cell class="cds--col-sm-3" v-else
              ><img
                width="20"
                height="20"
                class="fail-red"
                src="../../assets/misuse.svg"
            /></dds-structured-list-cell>
          </dds-structured-list-row>
          <dds-structured-list-row>
            <dds-structured-list-cell class="cds--col-sm-1"
              >License</dds-structured-list-cell
            ><dds-structured-list-cell
              class="cds--col-sm-3"
              v-if="experiment.metadata.package.license == null"
            >
              Not available
            </dds-structured-list-cell>
            <dds-structured-list-cell class="cds--col-sm-3" v-else>
              {{ experiment.metadata.package.license }}
            </dds-structured-list-cell>
          </dds-structured-list-row>
          <dds-structured-list-row>
            <dds-structured-list-cell class="cds--col-sm-1"
              >Maintainer</dds-structured-list-cell
            ><dds-structured-list-cell class="cds--col-sm-3">
              {{ experiment.metadata.package.maintainer }}
            </dds-structured-list-cell>
          </dds-structured-list-row>
          <dds-structured-list-row>
            <dds-structured-list-cell class="cds--col-sm-1">
              Available tags
            </dds-structured-list-cell>
            <dds-structured-list-cell
              class="cds--col-sm-3"
              :tags="tags.toString()"
            ></dds-structured-list-cell>
          </dds-structured-list-row>
          <dds-structured-list-row>
            <dds-structured-list-cell class="cds--col-sm-1">
              Available platforms
            </dds-structured-list-cell>
            <dds-structured-list-cell
              class="cds--col-sm-3"
              :tags="getAvailablePlatforms.toString()"
            ></dds-structured-list-cell>
          </dds-structured-list-row>
          <dds-structured-list-row>
            <dds-structured-list-cell class="cds--col-sm-1"
              >Keywords</dds-structured-list-cell
            >
            <dds-structured-list-cell
              class="cds--col-sm-3"
              :tags="experiment.metadata.package.keywords.toString()"
            >
            </dds-structured-list-cell>
          </dds-structured-list-row>
        </dds-structured-list-body>
      </dds-structured-list>
    </div>
  </div>
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
