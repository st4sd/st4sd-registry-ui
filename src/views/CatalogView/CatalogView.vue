<!-- 
  Copyright IBM Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0

  Author: Alessandro Pomponio
-->
<template>
  <div>
    <div id="toast-notification-container">
      <bx-toast-notification
        v-if="isError"
        kind="error"
        :title="errorDescription"
        :caption="errorStatusText + ' (error ' + errorCode + ')'"
        timeout="10000"
      >
      </bx-toast-notification>
    </div>
    <!-- Navigation breadcrumb -->
    <St4sdBreadcrumb :breadcrumbs="breadcrumbs" />

    <div>
      <!-- Advanced Search Filter -->
      <St4sdAdvancedSearchFilter
        :experiments="this.experiments"
        @updateSearchedExperiments="updateSearchedExperiments"
        @LoadingWheelStatusChanged="updateLoadingWheelStatus"
        @updateErrorHandling="updateErrorHandling"
      />

      <!-- Filter column -->
      <div class="cds--row">
        <div class="cds--col-lg-4">
          <St4sdLocalFilters
            :experiments="this.experiments"
            @updateSelectedFilters="updateSelectedFilters($event)"
          />
        </div>

        <!-- Card rows and columns -->
        <div class="cds--col-lg-12">
          <HttpErrorEmptyState
            id="http-error-empty-state"
            :errorDescription="errorDescription"
            :errorStatusText="errorStatusText"
            :errorCode="errorCode"
            v-if="isError"
          />
          <St4sdExperimentCards
            :searchedExperiments="this.searchedExperiments"
            :selectedFilters="this.selectedFilters"
            :experiments="this.experiments"
            :experimentsLoading="this.experimentsLoading"
            v-else
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//
import "@carbon/ibmdotcom-web-components/es/components/card/index.js";
import "@carbon/ibmdotcom-web-components/es/components/carousel/index.js";
import "@carbon/ibmdotcom-web-components/es/components/filter-panel/index.js";

import "@carbon/web-components/es/components/modal/index.js";
import "@carbon/web-components/es/components/code-snippet/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/tag/tag";
import "@carbon/web-components/es/components/breadcrumb/index.js";
import "@carbon/web-components/es/components/loading/index.js";

//
import axios from "axios";

import St4sdLocalFilters from "@/components/St4sdLocalFilters/St4sdLocalFilters.vue";
import St4sdAdvancedSearchFilter from "@/components/St4sdAdvancedSearchFilter/St4sdAdvancedSearchFilter.vue";
import St4sdExperimentCards from "@/components/St4sdExperimentCards/St4sdExperimentCards.vue";
import St4sdBreadcrumb from "@/components/St4sdBreadcrumb/St4sdBreadcrumb.vue";
import HttpErrorEmptyState from "@/components/EmptyState/HttpError.vue";

export default {
  name: "CatalogView",
  components: {
    St4sdLocalFilters,
    St4sdAdvancedSearchFilter,
    St4sdExperimentCards,
    St4sdBreadcrumb,
    HttpErrorEmptyState,
  },
  data() {
    return {
      selectedFilters: {},
      searchedExperiments: [],
      experiments: [],
      breadcrumbs: [{ name: "Virtual Experiments", path: "/" }],
      experimentsLoading: false,
      isError: false,
      errorStatusText: "",
      errorCode: 0,
      errorDescription: "Unable to load experiments",
    };
  },
  mounted() {
    axios
      .get(window.location.origin + "/registry-ui/backend/experiments/")
      .then((response) => {
        this.experiments = response.data.entries;
        this.searchedExperiments = response.data.entries;
      })
      .catch((error) => {
        this.errorStatusText = error.response.statusText;
        this.errorCode = error.response.status;
        this.isError = true;
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
    updateErrorHandling(error) {
      this.errorStatusText = error.response.statusText;
      this.errorCode = error.response.status;
      this.isError = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@carbon/grid";
@use "@carbon/layout";
@include grid.flex-grid();

@import "@/styles/toast-notification-styles.scss";

#http-error-empty-state {
  min-height: 24rem;
  margin-top: 1rem;
}

.breadcrumb {
  padding-bottom: layout.$spacing-07;
}
</style>
