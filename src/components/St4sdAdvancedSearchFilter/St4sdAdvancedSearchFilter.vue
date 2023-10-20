<template>
  <div class="search-container cds--row">
    <div
      class="cds--col-lg-4 cds--col-xlg-4 cds--col-max-4 search-dropdown-container"
    >
      <bx-dropdown
        size="xl"
        :value="searchSelector"
        @bx-dropdown-selected="searchSelector = $event.target.value"
      >
        <bx-dropdown-item
          v-for="(searchSelector, idx) in searchSelectorArray"
          :key="idx"
          :value="searchSelector.Id"
          >{{ searchSelector.Name }}
        </bx-dropdown-item>
      </bx-dropdown>
    </div>
    <div
      class="cds--col-lg-12 cds--col-xlg-12 cds--col-max-12 search-bar-container"
    >
      <bx-search
        size="xl"
        id="advancedSearchBar"
        @bx-search-input="handleSearchQueryChanges"
      ></bx-search>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "@carbon/web-components/es/components/dropdown/index.js";
import "@carbon/web-components/es/components/search/index.js";
import debounce from "lodash.debounce";

export default {
  name: "AdvancedSearchFilter",
  props: {
    experiments: Array,
  },
  data() {
    return {
      searchQuery: "",
      searchedExperiments: [],
      searchSelectorArray: [
        { Id: "name", Name: "Experiment Name" },
        { Id: "description", Name: "Experiment Description" },
        { Id: "maintainer", Name: "Experiment Maintainer" },
        { Id: "property_name", Name: "Property Name" },
      ],
      searchSelector: "",
      clearButtonToggle: true,
      debounceDelay: 1000,
      initialExperimentsSet: false,
    };
  },
  watch: {
    searchSelector() {
      this.startLoadingWheel();
      this.getSearchedExperiments();
    },
  },
  created() {
    this.debouncedHandler = debounce(() => {
      this.updateSearchedExperiments();
    }, this.debounceDelay);
  },
  mounted() {
    this.searchSelector = this.searchSelectorArray[0].Id;
  },
  beforeUnmount() {
    this.debouncedHandler.cancel();
  },
  methods: {
    handleSearchQueryChanges(event, ...args) {
      this.searchQuery = event.detail.value;
      this.startLoadingWheel();
      this.debouncedHandler(...args);
    },
    updateSearchedExperiments() {
      if (this.searchQuery == "") {
        this.searchedExperiments = this.experiments;
        this.$emit("updateSearchedExperiments", this.searchedExperiments);
        this.$emit("loadingStatusChanged", false);
      } else {
        this.getSearchedExperiments();
      }
    },
    startLoadingWheel() {
      this.$emit("loadingStatusChanged", true);
    },
    async getSearchedExperiments() {
      axios
        .get(
          window.location.origin +
            `/registry-ui/backend/experiments/?searchSelector=${this.searchSelector}&searchQuery=${this.searchQuery}`,
        )
        .then((response) => {
          this.searchedExperiments = response.data.entries;
        })
        .catch((error) => {
          this.updateErrorHandling(error);
          this.isError = true;
        })
        .finally(() => {
          if (!this.initialExperimentsSet) {
            this.$emit("setInitialExperiments", this.searchedExperiments);
            this.initialExperimentsSet = true;
          }

          this.$emit("updateSearchedExperiments", this.searchedExperiments);
          this.$emit("loadingStatusChanged", false);
        });
    },
    updateErrorHandling(error) {
      this.$emit("updateErrorHandling", error);
    },
  },
};
</script>

<style lang="scss">
@use "@carbon/grid";
@use "@carbon/layout";
.bx--list-box {
  max-height: 3rem;
  height: 3rem;
}
.card-row {
  margin-bottom: layout.$spacing-06;
}

@media screen and (min-width: 1056px) {
  .search-bar-container {
    padding-left: 0 !important;
  }

  .search-dropdown-container {
    padding-right: 0 !important;
  }
}
</style>
