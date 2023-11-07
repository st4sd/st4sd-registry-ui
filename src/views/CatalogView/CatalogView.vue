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
        :searchSelectorArray="[
          { Id: 'name', Name: 'Experiment Name' },
          { Id: 'description', Name: 'Experiment Description' },
          { Id: 'maintainer', Name: 'Experiment Maintainer' },
          { Id: 'property_name', Name: 'Property Name' },
        ]"
        @st4sd-search-query-changed="updateSearchQuery"
        @st4sd-search-selector-changed="updateSearchSelector"
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
            :loading="loading"
            v-else
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import debounce from "lodash.debounce";

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

import St4sdLocalFilters from "@/components/St4sdLocalFilters/St4sdLocalFilters.vue";
import St4sdAdvancedSearchFilter from "@/components/St4sdAdvancedSearchFilter/St4sdAdvancedSearchFilter.vue";
import St4sdExperimentCards from "@/components/St4sdExperimentCards/St4sdExperimentCards.vue";
import St4sdBreadcrumb from "@/components/St4sdBreadcrumb/St4sdBreadcrumb.vue";
import HttpErrorEmptyState from "@/components/EmptyState/HttpError.vue";

//

import { getDeploymentEndpoint } from "@/functions/public_path";

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
      loading: true,
      isError: false,
      errorStatusText: "",
      errorCode: 0,
      errorDescription: "Unable to load experiments",
      initalLoad: true,
      searchQuery: "",
      searchSelector: "name",
      debounceDelay: 1000,
      callsMade: 0,
    };
  },
  created() {
    this.loading = true;
    this.getSearchedData();

    this.debouncedHandler = debounce(() => {
      this.callsMade++;
      this.getSearchedData(this.callsMade);
    }, this.debounceDelay);
  },
  beforeUnmount() {
    this.debouncedHandler.cancel();
  },
  watch: {
    searchQuery() {
      this.handleSearch();
    },
    searchSelector() {
      this.handleSearch();
    },
  },
  methods: {
    handleSearch(...args) {
      this.loading = true;
      this.debouncedHandler(...args);
    },
    updateSearchQuery(searchQuery) {
      this.searchQuery = searchQuery;
    },
    updateSearchSelector(searchSelector) {
      this.searchSelector = searchSelector;
    },
    async getSearchedData(callID) {
      axios
        .get(
          `${getDeploymentEndpoint()}registry-ui/backend/experiments/?searchSelector=${
            this.searchSelector
          }&searchQuery=${this.searchQuery}`,
        )
        .then((response) => {
          if (this.initalLoad) {
            this.experiments = response.data.entries;
            this.searchedExperiments = response.data.entries;
          } else if (callID == this.callsMade) {
            this.searchedExperiments = response.data.entries;
          }
        })
        .catch((error) => {
          this.errorStatusText = error.response.statusText;
          this.errorCode = error.response.status;
          this.isError = true;
        })
        .finally(() => {
          if (this.initalLoad) {
            this.loading = false;
            this.initalLoad = false;
          } else if (callID == this.callsMade) {
            this.loading = false;
          }
        });
    },
    updateSelectedFilters(selectedFilters) {
      this.selectedFilters = selectedFilters;
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
