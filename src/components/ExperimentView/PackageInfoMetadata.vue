<template>
  <div class="cds--row pad1">
    <div class="cds--col-lg-4">
      <dds-content-block class="ve-content-block">
        <dds-content-block-heading class="ve-heading"
          >Metadata</dds-content-block-heading
        >
      </dds-content-block>
    </div>
    <div class="cds--col">
      <dds-structured-list>
        <dds-structured-list-body>
          <dds-structured-list-row>
            <dds-structured-list-cell
              tooltip="Contributed experiments have been developed or accepted by the core ST4SD team"
              >Contributed</dds-structured-list-cell
            ><dds-structured-list-cell
              v-if="checkExperimentIsContributed(experiment)"
              ><img
                width="20"
                height="20"
                class="success-green"
                src="../../assets/checkmark--filled.svg"
            /></dds-structured-list-cell>
            <dds-structured-list-cell v-else
              ><img
                width="20"
                height="20"
                class="fail-red"
                src="../../assets/misuse.svg"
            /></dds-structured-list-cell>
          </dds-structured-list-row>
          <dds-structured-list-row>
            <dds-structured-list-cell>License</dds-structured-list-cell
            ><dds-structured-list-cell
              v-if="experiment.metadata.package.license == null"
              tooltip="Reach out to the maintainer"
            >
              Not available
            </dds-structured-list-cell>
            <dds-structured-list-cell v-else>
              {{ experiment.metadata.package.license }}
            </dds-structured-list-cell>
          </dds-structured-list-row>
          <dds-structured-list-row>
            <dds-structured-list-cell>Maintainer</dds-structured-list-cell
            ><dds-structured-list-cell>
              {{ experiment.metadata.package.maintainer }}
            </dds-structured-list-cell>
          </dds-structured-list-row>
          <dds-structured-list-row>
            <dds-structured-list-cell>
              Available tags
            </dds-structured-list-cell>
            <dds-structured-list-cell :tags="tags"></dds-structured-list-cell>
          </dds-structured-list-row>
          <dds-structured-list-row>
            <dds-structured-list-cell>
              Available platforms
            </dds-structured-list-cell>
            <dds-structured-list-cell
              :tags="getAvailablePlatforms"
            ></dds-structured-list-cell>
          </dds-structured-list-row>
          <dds-structured-list-row>
            <dds-structured-list-cell>Keywords</dds-structured-list-cell>
            <dds-structured-list-cell
              :tags="experiment.metadata.package.keywords"
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

<style></style>
