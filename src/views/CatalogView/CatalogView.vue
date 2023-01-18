<!-- 
  Copyright IBM Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0

  Author: Alessandro Pomponio
-->
<template>
  <div class="cds--grid cds--grid--full-width">
    <!-- Navigation breadcrumb -->
    <St4sdBreadcrumb :breadcrumbs="breadcrumbs" />

    <template>
      <!-- Advanced Search Filter -->
      <St4sdAdvancedSearchFilter
        :experiments="this.experiments"
        @updateSearchedExperiments="updateSearchedExperiments"
        @LoadingWheelStatusChanged="updateLoadingWheelStatus"
      />

      <!-- Filter column -->
      <cv-row>
        <cv-column :lg="4">
          <St4sdLocalFilters
            :experiments="this.experiments"
            @updateSelectedFilters="updateSelectedFilters($event)"
          />
        </cv-column>

        <!-- Card rows and columns -->
        <cv-column :lg="12">
          <St4sdExperimentCards
            :searchedExperiments="this.searchedExperiments"
            :selectedFilters="this.selectedFilters"
            :experiments="this.experiments"
            :experimentsLoading="this.experimentsLoading"
          />
        </cv-column>
      </cv-row>
    </template>
  </div>
</template>

<script>
//
import "@carbon/ibmdotcom-web-components/es/components/card/index.js";
import "@carbon/ibmdotcom-web-components/es/components/carousel/index.js";
import "@carbon/ibmdotcom-web-components/es/components/filter-panel/index.js";

import "carbon-web-components/es/components/modal/index.js";
import "carbon-web-components/es/components/code-snippet/index.js";
import "carbon-web-components/es/components/button/index.js";
import "carbon-web-components/es/components/tag/tag";
import "carbon-web-components/es/components/breadcrumb/index.js";
import "carbon-web-components/es/components/loading/index.js";

//
import axios from "axios";

import St4sdLocalFilters from "@/components/St4sdLocalFilters/St4sdLocalFilters.vue";
import St4sdAdvancedSearchFilter from "@/components/St4sdAdvancedSearchFilter/St4sdAdvancedSearchFilter.vue";
import St4sdExperimentCards from "@/components/St4sdExperimentCards/St4sdExperimentCards.vue";
import St4sdBreadcrumb from "@/components/St4sdBreadcrumb/St4sdBreadcrumb.vue";

export default {
  name: "CatalogView",
  components: {
    St4sdLocalFilters,
    St4sdAdvancedSearchFilter,
    St4sdExperimentCards,
    St4sdBreadcrumb,
  },
  data() {
    return {
      selectedFilters: {},
      searchedExperiments: [],
      experiments: [],
      breadcrumbs: [{ name: "Virtual Experiments", path: "/" }],
      experimentsLoading: false,
    };
  },
  mounted() {
    axios
      .get(window.location.origin + "/registry-ui/backend/experiments/")
      .then((response) => {
        this.experiments = response.data.entries;
        this.searchedExperiments = response.data.entries;
      });
  },
  methods: {
    updateSelectedFilters(selectedFilters) {
      this.selectedFilters = selectedFilters;
    },
    updateSearchedExperiments(searchedExperiments) {
      this.searchedExperiments = searchedExperiments;
    },
    updateLoadingWheelStatus(loadingWheelStatus) {
      this.experimentsLoading = loadingWheelStatus;
    },
  },
};
</script>

<style lang="scss">
@use "@carbon/grid";
@use "@carbon/layout";
@include grid.flex-grid();

.breadcrumb {
  padding-bottom: layout.$spacing-07;
}
</style>
