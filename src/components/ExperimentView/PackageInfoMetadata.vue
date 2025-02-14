<template>
  <div class="cds--row pad1">
    <ExperimentViewContentBlock title="Metadata" />
    <div class="cds--col-sm-4 cds--col-md-6 cds--col-lg-12">
      <cds-structured-list>
        <cds-structured-list-body>
          <cds-structured-list-row>
            <cds-structured-list-cell class="cds--col-sm-1">
              Contributed
              <cds-tooltip align="bottom">
                <div>
                  <img width="16" height="16" src="@/assets/info.svg" />
                </div>
                <cds-tooltip-content>
                  Contributed experiments have been developed or accepted by the
                  core ST4SD team
                </cds-tooltip-content>
              </cds-tooltip>
            </cds-structured-list-cell>
            <cds-structured-list-cell
              class="cds--col-sm-3"
              v-if="checkExperimentIsContributed(experiment)"
              ><img
                width="20"
                height="20"
                class="success-green"
                src="../../assets/checkmark--filled.svg"
            /></cds-structured-list-cell>
            <cds-structured-list-cell class="cds--col-sm-3" v-else
              ><img
                width="20"
                height="20"
                class="fail-red"
                src="../../assets/misuse.svg"
            /></cds-structured-list-cell>
          </cds-structured-list-row>
          <cds-structured-list-row>
            <cds-structured-list-cell class="cds--col-sm-1"
              >License</cds-structured-list-cell
            ><cds-structured-list-cell
              class="cds--col-sm-3"
              v-if="experiment.metadata.package.license == null"
            >
              Not available
            </cds-structured-list-cell>
            <cds-structured-list-cell class="cds--col-sm-3" v-else>
              {{ experiment.metadata.package.license }}
            </cds-structured-list-cell>
          </cds-structured-list-row>
          <cds-structured-list-row>
            <cds-structured-list-cell class="cds--col-sm-1"
              >Maintainer</cds-structured-list-cell
            ><cds-structured-list-cell class="cds--col-sm-3">
              {{ experiment.metadata.package.maintainer }}
            </cds-structured-list-cell>
          </cds-structured-list-row>
          <cds-structured-list-row>
            <cds-structured-list-cell class="cds--col-sm-1">
              Available tags
            </cds-structured-list-cell>
            <cds-structured-list-cell v-if="tags != null" class="cds--col-sm-3">
              <div class="tag-group-container">
                <cds-tag v-for="(tag, i) in tags" :key="i" type="green">{{
                  tag.toString()
                }}</cds-tag>
              </div>
            </cds-structured-list-cell>
            <cds-structured-list-cell v-else class="cds--col-sm-3"
              >Failed to load</cds-structured-list-cell
            >
          </cds-structured-list-row>
          <cds-structured-list-row>
            <cds-structured-list-cell class="cds--col-sm-1">
              Available platforms
            </cds-structured-list-cell>
            <cds-structured-list-cell class="cds--col-sm-3">
              <div class="tag-group-container">
                <cds-tag
                  v-for="(platform, i) in getAvailablePlatforms"
                  :key="i"
                  type="green"
                  >{{ platform.toString() }}</cds-tag
                >
              </div>
            </cds-structured-list-cell>
          </cds-structured-list-row>
          <cds-structured-list-row>
            <cds-structured-list-cell class="cds--col-sm-1"
              >Keywords</cds-structured-list-cell
            >
            <cds-structured-list-cell class="cds--col-sm-3">
              <div class="tag-group-container">
                <cds-tag
                  v-for="(keyword, i) in experiment.metadata.package.keywords"
                  :key="i"
                  type="green"
                  >{{ keyword.toString() }}</cds-tag
                >
              </div>
            </cds-structured-list-cell>
          </cds-structured-list-row>
        </cds-structured-list-body>
      </cds-structured-list>
    </div>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/tooltip/index.js";

import ExperimentViewContentBlock from "./ExperimentViewContentBlock.vue";

import { checkExperimentIsContributed } from "@/functions/origin_checks";
export default {
  name: "PackageInfoMetadata",
  props: {
    tags: Array,
    experiment: Object,
    getAvailablePlatforms: Array,
  },
  components: {
    ExperimentViewContentBlock,
  },
  methods: {
    checkExperimentIsContributed,
  },
};
</script>
<style lang="scss" scoped>
@use "@/styles/structured-list-grid-column-styles.scss";
@use "@/styles/svg.scss";
</style>
